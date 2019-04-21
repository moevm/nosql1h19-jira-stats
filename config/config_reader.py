from configparser import ConfigParser

CONFIG_PATH = 'config/config.ini'


def get_config_parser():
    config = ConfigParser()
    config.read(CONFIG_PATH)

    return config


def get_db_name():
    return get_config_parser().get("db", "name")


def get_db_host():
    return get_config_parser().get("db", "host")


def get_db_port():
    return int(get_config_parser().get("db", "port"))
