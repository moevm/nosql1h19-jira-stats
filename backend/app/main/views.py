from flask import render_template, session, request, redirect, url_for, abort, jsonify, json
from app.main import main
from app.main.models import User, Issue
from app.main.jira import get_projects, import_issues
from datetime import datetime


@main.route('/', methods=['GET'])
def index():
    project_list = get_projects()

    print(list(Issue.group_by_work_type()))

    return render_template("main/index.html", project_list=project_list)


@main.route('/hours_per_work_type_table', methods=['GET'])
def get_hours_per_work_type_table():
    start_date = datetime.strptime(request.args.get('start_date'), '%Y-%m-%d')
    end_date = datetime.strptime(request.args.get('end_date'), '%Y-%m-%d')

    try:
        duration = request.args.get('duration')
    except KeyError:
        duration = 'month'

    response = jsonify(Issue.hours_per_work_type_table(start_datetime=start_date, end_datetime=end_date,
                                                       duration=duration))
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


@main.route('/', methods=['POST'])
def show_efficiency():
    options = {
        'component': request.form['component'],
        'first_date': request.form['first_date'],
        'second_date': request.form['second_date']}

    issue_list = Issue(component=options['component']).find_by_component()

    return render_template("main/efficiency.html", issue_list=issue_list)


@main.route('/import/', methods=['GET'])
def import_jira_issues():
    import_issues()

    return redirect(url_for('.index'))