import os
import config_reader as CR

basedir = os.path.abspath(os.path.dirname(__file__))
app_name = "app"


class Config:
    MONGODB_DB = CR.get_db_name()
    MONGODB_HOST = CR.get_db_host()
    MONGODB_PORT = CR.get_db_port()

    UPLOAD_FOLDER = os.path.join(basedir, app_name, 'static/')

    @staticmethod
    def init_app(app):
        pass


class DevCongig(Config):
    DEBUG = True


class ProdConfig(Config):
    pass


config = {
    'dev': DevCongig,
    'prod': ProdConfig
}
