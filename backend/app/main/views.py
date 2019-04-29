from flask import render_template, session, request, redirect, url_for, abort, jsonify, json
from app.main import main
from app.main.models import User, Issue
from app.main.jira import login_jira, get_projects, import_issues
from datetime import datetime


@main.route('/', methods=['GET'])
def index():
    project_list = get_projects()

    print(list(Issue.group_by_work_type()))

    return render_template("main/index.html", project_list=project_list)


@main.route('/auth/', methods=['POST'])
def auth():
    post_data = request.json
    try:
        jira = login_jira(
            post_data['jira_url'],
            post_data['username'],
            post_data['password'])
        response = jsonify({'success': True})
        status_code = 200
    except Exception as e:
        response = jsonify({'success': False, 'exception': e.__str__()})
        status_code = 500
    response.headers.add('Access-Control-Allow-Origin', '*')

    return response, status_code

@main.route('/hours_per_work_type_table', methods=['GET'])
def get_hours_per_work_type_table():
    start_date = datetime.strptime(request.args.get('start_date'), '%Y-%m-%d')
    end_date = datetime.strptime(request.args.get('end_date'), '%Y-%m-%d')
    category = request.args.get('category')

    try:
        duration = request.args.get('duration')
    except KeyError:
        duration = 'month'

    response = jsonify(Issue.hours_per_work_type_table(start_datetime=start_date, end_datetime=end_date,
                                                       duration=duration, category=category))
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


@main.route('/hours_per_work_type_chart', methods=['GET'])
def get_hours_per_work_type_chart():
    start_date = datetime.strptime(request.args.get('start_date'), '%Y-%m-%d')
    end_date = datetime.strptime(request.args.get('end_date'), '%Y-%m-%d')
    category = request.args.get('category')

    try:
        duration = request.args.get('duration')
    except KeyError:
        duration = 'month'

    response = jsonify(Issue.hours_per_work_type_chart(start_datetime=start_date, end_datetime=end_date,
                                                       duration=duration, category=category))
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
