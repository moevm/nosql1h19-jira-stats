import os
import config.config_reader as cr

BASEDIR = os.path.abspath(os.path.dirname(__file__))
APP_NAME = "app"


class Config:
    UPLOAD_FOLDER = os.path.join(BASEDIR, APP_NAME, 'static/')
    CSRF_ENABLED = True
    JIRA_URL = 'https://jira.robotbull.com'
    JIRA_USERNAME = ''
    JIRA_PASSWORD = ''
    MONGO_URI = 'mongodb://{}:{}/'.format(cr.get_db_host(), cr.get_db_port())
    MONGO_DBS = cr.get_db_name()
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

class DevConfig(Config):
    DEBUG = True


class ProdConfig(Config):
    DEBUG = False
