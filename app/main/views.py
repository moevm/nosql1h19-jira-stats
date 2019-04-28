from flask import render_template, session, request, redirect, url_for, abort, jsonify
from app.main import main
# from app.main.models import User, Issue
from app.main.jira import get_projects, import_issues


@main.route('/', methods=['GET'])
def index():
	project_list = get_projects()

	return render_template("main/index.html", project_list=project_list)


# @main.route('/', methods=['POST'])
# def show_efficiency():
# 	options = {
# 		'component': request.form['component'],
# 		'first_date': request.form['first_date'],
# 		'second_date': request.form['second_date']}
#
# 	issue_list = Issue(component=options['component']).find_by_component()
#
# 	return render_template("main/efficiency.html", issue_list=issue_list)


@main.route('/import/', methods=['GET'])
def import_jira_issues():
	import_issues()

	return redirect(url_for('.index'))
