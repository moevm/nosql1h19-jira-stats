from flask import ender_template, session, request, redirect, url_for, abort, jsonify
from app.main import main


@main.route('/')
def index():
    return render_template("main/index.html")
