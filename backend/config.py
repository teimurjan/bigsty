import os

from dotenv import load_dotenv
from paths import APP_ROOT_PATH

load_dotenv(os.path.join(APP_ROOT_PATH, '.env'))

class Config:
    DEBUG = False
    TESTING = False
    CSRF_ENABLED = True
    SECRET_KEY = os.environ.get('SECRET_KEY')
    DB_URL = os.environ.get('DB_URL')
    SQLALCHEMY_TRACK_MODIFICATIONS = False


class ProductionConfig(Config):
    ENV = "production"
    DEBUG = False


class DevelopmentConfig(Config):
    ENV = "development"
    DEVELOPMENT = True
    DEBUG = True
    UPLOAD_FOLDER = os.environ.get('UPLOAD_FOLDER')


class TestingConfig(Config):
    ENV = "development"
    TESTING = True
