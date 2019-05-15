from flask_script import Manager
from app.create_app import app
from app.main import main as main_blueprint

app.register_blueprint(main_blueprint)
manager = Manager(app)

if __name__ == '__main__':
    manager.run()
