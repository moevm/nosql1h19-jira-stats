import os

from raven import Client

BASEDIR = os.path.abspath(os.path.dirname(__file__))
APP_NAME = "app"


class Config:
    UPLOAD_FOLDER = os.path.join(BASEDIR, APP_NAME, 'static/')
    CSRF_ENABLED = True
    JIRA_URL = os.environ.get('JIRA_URL')
    JIRA_USERNAME = os.environ.get('JIRA_USERNAME')
    JIRA_PASSWORD = os.environ.get('JIRA_PASSWORD')
    MONGO_URI = 'mongodb://{}:{}/'.format(os.environ.get('MONGODB_HOST', '127.0.0.1'),
                                          os.environ.get('MONGODB_PORT', '27017'))
    MONGO_DBS = os.environ.get('MONGODB_NAME', 'jira-stats-dev')

    JIRA_COMPONENTS = [
        'PlanSharing',
        'ESS',
        'FinTech',
        'RobotBull',
        'Rusintermo']
    JIRA_CATEGORIES = {
        'PSDEV': 'Разработка',
        'ITDEV': 'Разработка',
        'ITOPS': 'Разработка',
        'ADM': 'Администрирование',
        'DESIGN': 'Дизайн'}
    JIRA_EPIC_ID = 'WORK'
    JIRA_EPIC_PROJECT = "WORK'и"
    JSON_AS_ASCII = False
    SENTRY_CLIENT = Client(
        'https://575ef3411b3446508046d99b029acd7d:3d43c62c9c044bc1b638dd21805ef329@sentry.robotbull.com/11')


class DevConfig(Config):
    DEBUG = True


class ProdConfig(Config):
    DEBUG = False
