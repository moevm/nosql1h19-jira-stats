from flask import Flask
from flask_cors import CORS
from flask_login import LoginManager
from pymongo import MongoClient
from config.config import Config, DevConfig

app = Flask(__name__)
CORS(app)
app.config.from_object(DevConfig)

client = MongoClient(Config.MONGO_URI)
db = client[Config.MONGO_DBS]
login_manager = LoginManager(app)
login_manager.session_protection = "strong"
