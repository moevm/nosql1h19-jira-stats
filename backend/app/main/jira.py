from config.config import Config
from app.create_app import db
from jira import JIRA
import requests
import base64
from dateutil.parser import parse
import time


# авторизация (возвращает объект jira)
def login_jira(username, password):
	jira_options = {'server': Config.JIRA_URL}
	try:
		jira = JIRA(
			options=jira_options,
			basic_auth=(username, password))
		print(jira.current_user())
	except:
		raise Exception('Error with Jira auth')

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
	jira = login_jira(Config.JIRA_USERNAME, Config.JIRA_PASSWORD)
	component_dict = {component: get_epics(jira, component) for component in Config.JIRA_COMPONENTS}

	for component in component_dict.keys():
		epic_list = component_dict[component]
		for epic in epic_list:
			jql = '"Ссылка на эпик" = "{}" ORDER BY priority DESC, due ASC'.format(epic.key)
			epic_issues = jira.search_issues(jql, maxResults=False)
			for issue in epic_issues:
				if not issue.fields.timespent and issue.fields.resolutiondate:
					timespent = issue.fields.timeoriginalestimate
				else:
					timespent = issue.fields.timespent

				print(issue.fields.created, issue.fields.resolutiondate)

				db.issue.insert_one({
					'key': issue.key,
					'created': parse(issue.fields.created),
					'started': parse(issue.fields.customfield_10301) if issue.fields.customfield_10301 else None,
					'duedate': parse(issue.fields.duedate) if issue.fields.duedate else None,
					'resolutiondate': parse(issue.fields.resolutiondate) if issue.fields.resolutiondate else None,
					'assignee': issue.fields.assignee.name if issue.fields.assignee else None,
					'timespent': timespent,
					'status': issue.fields.status.name,
					'component': component,
					'project': epic.key,
					'category': Config.JIRA_CATEGORIES[issue.fields.project.key]})

	# PlanSharing
	component = 'PlanSharing'
	project = 'ПланШеринг'
	jql = 'project = {} ORDER BY key ASC'.format(project)
	project_issues = jira.search_issues(jql, maxResults=False)
	for issue in project_issues:
		if not issue.fields.timespent and issue.fields.resolutiondate:
			timespent = issue.fields.timeoriginalestimate
		else:
			timespent = issue.fields.timespent

		db.issue.insert_one({
			'key': issue.key,
			'created': parse(issue.fields.created),
			'started': parse(issue.fields.customfield_10301) if issue.fields.customfield_10301 else None,
			'duedate': parse(issue.fields.duedate) if issue.fields.duedate else None,
			'resolutiondate': parse(issue.fields.resolutiondate) if issue.fields.resolutiondate else None,
			'assignee': issue.fields.assignee.name if issue.fields.assignee else None,
			'timespent': timespent,
			'status': issue.fields.status.name,
			'component': component,
			'project': issue.fields.project.key,
			'category': Config.JIRA_CATEGORIES[issue.fields.project.key]})

	return True


# выборка эпиков по заказчику
def get_epics(jira, component):
	jql = 'project = "{}" AND component = {} ORDER BY key ASC'.format(Config.JIRA_EPIC_PROJECT, component)
	epic_list = jira.search_issues(jql, maxResults=False)

	return epic_list
