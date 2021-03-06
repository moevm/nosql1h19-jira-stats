from flask import render_template, session, request, redirect, url_for, abort, jsonify, json, send_file
from app.main import main
from app.main.models import User, Issue
from app.main.jira import login_jira, get_projects, import_issues
from datetime import datetime, timezone
from config.config import Config
import os
from io import StringIO, BytesIO


@main.route('/auth/', methods=['POST'])
def auth():
    post_data = request.json
    try:
        jira = login_jira(
            post_data['jira_url'],
            post_data['username'],
            post_data['password'])
        os.environ["JIRA_URL"] = post_data['jira_url']
        os.environ["JIRA_USERNAME"] = post_data['username']
        os.environ["JIRA_PASSWORD"] = post_data['password']
        return jsonify({'success': True}), 200
    except Exception as e:
        Config.SENTRY_CLIENT.captureException()
        return jsonify({'success': False, 'exception': e.__str__()}), 500


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

    return response


@main.route('/hours_per_project_assignee_chart', methods=['GET'])
def hours_per_project_assignee_chart():
    try:
        start_date = datetime.strptime(request.args.get('start_date'), '%Y-%m-%d')
        end_date = datetime.strptime(request.args.get('end_date'), '%Y-%m-%d')
        category = request.args.get('category', None)
        project = request.args.get('project', None)
        assignee = request.args.get('assignee', None)

        response = jsonify(Issue.hours_per_project_assignee_chart(start_datetime=start_date, end_datetime=end_date,
                                                                  project=project, category=category,
                                                                  assignee=assignee))
    except Exception as e:
        Config.SENTRY_CLIENT.captureException()
        response = jsonify({'success': False, 'exception': e.__str__()}), 500
    return response


@main.route('/hours_per_project_assignee_table', methods=['GET'])
def hours_per_project_assignee_table():
    try:
        start_date = datetime.strptime(request.args.get('start_date'), '%Y-%m-%d')
        end_date = datetime.strptime(request.args.get('end_date'), '%Y-%m-%d')
        category = request.args.get('category', None)
        project = request.args.get('project', None)
        assignee = request.args.get('assignee', None)

        response = jsonify(Issue.hours_per_project_assignee_table(start_datetime=start_date, end_datetime=end_date,
                                                                  project=project, category=category,
                                                                  assignee=assignee))
    except Exception as e:
        Config.SENTRY_CLIENT.captureException()
        response = jsonify({'success': False, 'exception': e.__str__()}), 500
    return response


@main.route('/hours_per_project_table', methods=['GET'])
def hours_per_project_table():
    try:
        start_date = datetime.strptime(request.args.get('start_date'), '%Y-%m-%d')
        end_date = datetime.strptime(request.args.get('end_date'), '%Y-%m-%d')
        try:
            component = request.args.get('component')
        except:
            component = None

        response = jsonify(Issue.hours_per_project_table(component=component, start_datetime=start_date, end_datetime=end_date))
    except Exception as e:
        Config.SENTRY_CLIENT.captureException()
        response = jsonify({'success': False, 'exception': e.__str__()}), 500
    return response


@main.route('/hours_per_project_chart', methods=['GET'])
def hours_per_project_chart():
    try:
        start_date = datetime.strptime(request.args.get('start_date'), '%Y-%m-%d')
        end_date = datetime.strptime(request.args.get('end_date'), '%Y-%m-%d')
        try:
            component = request.args.get('component')
        except:
            component = None

        response = jsonify(Issue.hours_per_project_chart(component=component, start_datetime=start_date, end_datetime=end_date))
    except Exception as e:
        Config.SENTRY_CLIENT.captureException()
        response = jsonify({'success': False, 'exception': e.__str__()}), 500
    return response


@main.route('/import/', methods=['GET'])
def import_jira_issues():
    try:
        import_issues()
    except Exception as e:
        Config.SENTRY_CLIENT.captureException()
        return jsonify({'success': False, 'exception': e.__str__()}), 500

    return jsonify({'success': True}), 200


@main.route('/export_documents_to_json', methods=['GET'])
def export_documents_to_json():
    try:
        docs_json = Issue.export_documents_to_json()
        buffer = StringIO()
        buffer.write(docs_json)
        binary = BytesIO()
        binary.write(buffer.getvalue().encode('utf-8'))
        binary.seek(0)
        buffer.close()
        return send_file(filename_or_fp=binary, as_attachment=True,
                         attachment_filename="jira_stats_export_{}.json".format(
                             datetime.now().strftime("%d.%m.%Y_%H:%M:%S")))
    except Exception as e:
        Config.SENTRY_CLIENT.captureException()
        return jsonify({'success': False, 'exception': e.__str__()}), 500


@main.route('/import_documents_from_json', methods=['POST'])
def import_documents_from_json():
    try:
        fp = request.files["file"]
        fp.seek(0)
        Issue.import_documents_from_json(fp.read())
    except Exception as e:
        Config.SENTRY_CLIENT.captureException()
        return jsonify({'success': False, 'exception': e.__str__()}), 500
    return jsonify({'success': True}), 200
