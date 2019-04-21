import os
import config_reader as cr

basedir = os.path.abspath(os.path.dirname(__file__))
app_name = "app"


class Config:
    MONGO_URI = 'mongodb://{}:{}/{}'.format(cr.get_db_host(), cr.get_db_port(), cr.get_db_name())
    UPLOAD_FOLDER = os.path.join(basedir, app_name, 'static/')


class DevCongig(Config):
    DEBUG = True


class ProdConfig(Config):
    DEBUG = False
