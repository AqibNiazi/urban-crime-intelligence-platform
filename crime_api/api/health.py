from flask import Blueprint, jsonify
from services.model_registry import registry

health_bp = Blueprint("health", __name__)


@health_bp.route("/health", methods=["GET"])
def health_check():
    """
    Liveness + readiness probe.
    Returns 200 when all models are loaded, 503 if any are missing.
    """
    model_status = registry.status()
    all_ready = all(model_status.values())

    return jsonify({
        "status": "ok" if all_ready else "degraded",
        "models": model_status,
    }), 200 if all_ready else 503
