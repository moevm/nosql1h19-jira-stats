from flask import Flask
from config import config
from flask_login import LoginManager
import config_reader as CR
from flask_pymongo import PyMongo


login_manager = LoginManager()
login_manager.session_protection = "strong"

stepic = None


def create_app(config_name='dev'):
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    config[config_name].init_app(app)


    # HARD CODED: переделать
    app.config['MONGO_DBNAME'] = 'test'
    app.config['MONGO_URI'] = 'mongodb://mongo:27017/test'

    mongo = PyMongo(app)

    login_manager.init_app(app)

    from .main import main as main_blueprint
    app.register_blueprint(main_blueprint)
    from .api import api as api_1_blueprint
    app.register_blueprint(api_1_blueprint, url_prefix='/api/v1')

    return app
