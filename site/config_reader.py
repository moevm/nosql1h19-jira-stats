from configparser import ConfigParser
import os

CONFIG_PATH = os.environ.get('CONFIG_PATH') or os.path.join(os.path.abspath(os.path.dirname(__file__)), "config.ini")


def get_config_parser():
    config = ConfigParser()
    config.read(CONFIG_PATH)
    return config


def update_config(db_name,
                  db_host,
                  db_port):
    config = ConfigParser()
    config.read(CONFIG_PATH)
    config.set("db", "name", db_name)
    config.set("db", "host", db_host)
    config.set("db", "port", db_port)
    config.write(open(CONFIG_PATH, "w"))


def get_db_name():
    return get_config_parser().get("db", "name")


def get_db_host():
    return get_config_parser().get("db", "host")


def get_db_port():
    return int(get_config_parser().get("db", "port"))
