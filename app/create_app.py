from flask import Flask
from flask_login import LoginManager
from pymongo import MongoClient
from config.config import MONGO_URI

app = Flask(__name__)
app.config.from_object('config.DevConfig')

db = MongoClient(MONGO_URI)
login_manager = LoginManager(app)
login_manager.session_protection = "strong"
