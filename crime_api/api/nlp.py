from flask import Blueprint, request, jsonify
from services.nlp_service import classify_description

nlp_bp = Blueprint("nlp", __name__)

_MIN_DESC_LENGTH = 5
_MAX_DESC_LENGTH = 500


@nlp_bp.route("/nlp-classify", methods=["POST"])
def nlp_classify():
    """
    Classify a crime description text into a crime category.

    Body:
        description  str  Free-text crime description (5 – 500 chars)
    """
    payload = request.get_json(silent=True)
    if payload is None:
        return jsonify({"error": "Request body must be valid JSON"}), 400

    description = payload.get("description", "")
    if not isinstance(description, str):
        return jsonify({"error": "'description' must be a string"}), 422

    description = description.strip()
    if len(description) < _MIN_DESC_LENGTH:
        return jsonify({"error": f"Description must be at least {_MIN_DESC_LENGTH} characters"}), 422
    if len(description) > _MAX_DESC_LENGTH:
        return jsonify({"error": f"Description must be at most {_MAX_DESC_LENGTH} characters"}), 422

    try:
        result = classify_description(description)
        return jsonify(result), 200
    except Exception as exc:
        return jsonify({"error": "Classification failed", "detail": str(exc)}), 500
