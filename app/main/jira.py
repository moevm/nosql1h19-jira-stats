from config.config import Config
from app.main.models import Issue
from jira import JIRA
import requests
import base64
from dateutil.parser import parse
import time


# авторизация (возвращает объект jira)
def login_jira():
	jira_options = {'server': Config.JIRA_URL}
	jira = JIRA(
		options=jira_options,
		basic_auth=(
			Config.JIRA_USERNAME,
			Config.JIRA_PASSWORD))

	return jira


# данные авторизации для запроса
def prepare_jira_creds():
	encoded_credentials = base64.b64encode(
		bytes('{}:{}'.format(
			Config.JIRA_USERNAME,
			Config.JIRA_PASSWORD),
			'utf-8'))

	return 'Basic ' + encoded_credentials.decode('utf-8')


# поиск проектов в jira
def get_projects():
	authorization_header = prepare_jira_creds()
	project_list = requests.get(
		url=Config.JIRA_URL + '/rest/api/latest/project/' + Config.JIRA_EPIC_ID + '/components',
		headers={'Authorization': authorization_header}).json()

	return project_list


# сбор данных для отчета
def import_issues():
	jira = login_jira()
	component_dict = {component: get_epics(jira, component) for component in Config.JIRA_COMPONENTS}

	for component in component_dict.keys():
		epic_list = component_dict[component]
		for epic in epic_list:
			jql = '"Ссылка на эпик" = "{}" ORDER BY priority DESC, due ASC'.format(epic.key)
			epic_issues = custom_issue(jira.search_issues(jql, maxResults=False))
			for issue in epic_issues:
				new_issue = Issue(
					issue.key,
					issue.fields.created,
					issue.fields.assignee.name,
					issue.fields.resolutiondate,
					issue.fields.timeestimate,
					issue.fields.status.name,
					component,
					epic.key,
					'categoty')
				new_issue.save()

	return True


# выборка эпиков по заказчику
def get_epics(jira, component):
	jql = 'project = "{}" AND component = {} ORDER BY key ASC'.format(Config.JIRA_EPIC_PROJECT, component)
	epic_list = custom_issue(jira.search_issues(jql, maxResults=False))

	return epic_list


# изменение формата даты и времени
def custom_issue(issue_list):
	for issue in issue_list:
		# дата создания issue
		issue.fields.created = parse(issue.fields.created)
		# дата закрытия issue
		if issue.fields.resolutiondate:
			issue.fields.resolutiondate = parse(issue.fields.resolutiondate)
		# дата начала issue
		if issue.fields.customfield_10301:
			issue.fields.customfield_10301 = parse(issue.fields.customfield_10301)
		# плановое время окончания issue
		if issue.fields.duedate:
			issue.fields.duedate = parse(issue.fields.duedate)

	return issue_list
