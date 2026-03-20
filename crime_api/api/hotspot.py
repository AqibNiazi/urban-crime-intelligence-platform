from flask import Blueprint, request, jsonify
from services.hotspot_service import get_hotspot

hotspot_bp = Blueprint("hotspot", __name__)


def _validate(payload: dict) -> str | None:
    for field in ("latitude", "longitude"):
        if field not in payload:
            return f"Missing field: '{field}'"
        try:
            float(payload[field])
        except (TypeError, ValueError):
            return f"'{field}' must be a number"
    return None


@hotspot_bp.route("/hotspot", methods=["POST"])
def hotspot():
    """
    Return the crime hotspot cluster for a given location.

    Body:
        latitude   float  WGS-84 latitude
        longitude  float  WGS-84 longitude
    """
    payload = request.get_json(silent=True)
    if payload is None:
        return jsonify({"error": "Request body must be valid JSON"}), 400

    error = _validate(payload)
    if error:
        return jsonify({"error": error}), 422

    try:
        result = get_hotspot(
            latitude=float(payload["latitude"]),
            longitude=float(payload["longitude"]),
        )
        return jsonify(result), 200
    except Exception as exc:
        return jsonify({"error": "Hotspot lookup failed", "detail": str(exc)}), 500
