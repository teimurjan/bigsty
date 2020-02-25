import os

from paths import APP_ROOT_PATH

class Config:
    DEBUG = False
    TESTING = False
    CSRF_ENABLED = True
    SECRET_KEY = os.environ.get('SECRET_KEY')
    DB_URL = os.environ.get('DB_URL')
    ELASTICSEARCH_URL = os.environ.get('ELASTICSEARCH_URL')
    ALLOWED_ORIGINS = os.environ.get('ALLOWED_ORIGINS').split(
        ',') if os.environ.get('ALLOWED_ORIGINS') else []
    SQLALCHEMY_TRACK_MODIFICATIONS = True
    AWS_ACCESS_KEY_ID = os.environ.get('AWS_ACCESS_KEY_ID')
    AWS_SECRET_ACCESS_KEY = os.environ.get('AWS_SECRET_ACCESS_KEY')
    AWS_BUCKET_NAME = os.environ.get('AWS_BUCKET_NAME')
    AWS_DEFAULT_REGION = os.environ.get('AWS_DEFAULT_REGION')


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
