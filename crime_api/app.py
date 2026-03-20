"""
Entry point — application factory pattern.

Run locally:
    python app.py

Production (gunicorn):
    gunicorn "app:create_app()" --bind 0.0.0.0:5000 --workers 2
"""

import logging
import os

from flask import Flask
from flask_cors import CORS

from config import get_config
from services.model_registry import registry
from api.health import health_bp
from api.predict import predict_bp
from api.nlp import nlp_bp
from api.forecast import forecast_bp
from api.hotspot import hotspot_bp

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(name)s — %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger(__name__)


def create_app() -> Flask:
    app = Flask(__name__)
    app.config.from_object(get_config())

    # Allow requests from the React dev server and any deployed frontend
    CORS(app, resources={r"/*": {"origins": "*"}})

    # Load all ML models before the first request is served
    registry.model_dir = app.config["MODEL_DIR"]
    registry.load()

    # Register blueprints — all routes live under /api/v1
    url_prefix = "/api/v1"
    app.register_blueprint(health_bp,   url_prefix=url_prefix)
    app.register_blueprint(predict_bp,  url_prefix=url_prefix)
    app.register_blueprint(nlp_bp,      url_prefix=url_prefix)
    app.register_blueprint(forecast_bp, url_prefix=url_prefix)
    app.register_blueprint(hotspot_bp,  url_prefix=url_prefix)

    logger.info("Application ready. Registered routes:")
    for rule in app.url_map.iter_rules():
        logger.info("  %-35s %s", rule.rule, list(rule.methods - {"HEAD", "OPTIONS"}))

    return app


if __name__ == "__main__":
    application = create_app()
    application.run(
        host="0.0.0.0",
        port=int(os.getenv("PORT", 5000)),
        debug=application.config["DEBUG"],
    )
