import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    DEBUG = False
    TESTING = False
    MODEL_DIR = os.getenv("MODEL_DIR", "models")
    PORT = int(os.getenv("PORT", 5000))


class DevelopmentConfig(Config):
    DEBUG = True


class ProductionConfig(Config):
    DEBUG = False


class TestingConfig(Config):
    TESTING = True
    MODEL_DIR = "tests/fixtures"


config_map = {
    "development": DevelopmentConfig,
    "production": ProductionConfig,
    "testing": TestingConfig,
}


def get_config():
    env = os.getenv("FLASK_ENV", "development")
    return config_map.get(env, DevelopmentConfig)
