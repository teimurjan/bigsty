import os

from paths import APP_ROOT_PATH

class Config:
    DEBUG = False
    TESTING = False
    CSRF_ENABLED = True
    SECRET_KEY = os.environ.get('SECRET_KEY')
    DB_URL = os.environ.get('DB_URL')
    UPLOAD_FOLDER = os.environ.get('UPLOAD_FOLDER')
    ELASTICSEARCH_URL = os.environ.get('ELASTICSEARCH_URL')
    ALLOWED_ORIGINS = os.environ.get('ALLOWED_ORIGINS').split(
        ',') if os.environ.get('ALLOWED_ORIGINS') else []
    SQLALCHEMY_TRACK_MODIFICATIONS = True


class ProductionConfig(Config):
    ENV = "production"
    DEBUG = False


class DevelopmentConfig(Config):
    ENV = "development"
    DEVELOPMENT = True
    DEBUG = True


class TestingConfig(Config):
    ENV = "development"
    TESTING = True
