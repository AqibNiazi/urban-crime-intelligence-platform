from flask import Blueprint, request, jsonify
from services.predictor import predict_crime_type

predict_bp = Blueprint("predict", __name__)

_REQUIRED_FIELDS = [
    "latitude",
    "longitude",
    "hour",
    "month",
    "day_of_week",
    "is_weekend",
    "season",
]

_FIELD_RANGES = {
    "hour": (0, 23),
    "month": (1, 12),
    "day_of_week": (0, 6),
    "is_weekend": (0, 1),
    "season": (0, 3),
    "latitude": (41.6, 42.1),
    "longitude": (-87.9, -87.5),
}


def _validate(payload: dict) -> str | None:
    missing = [f for f in _REQUIRED_FIELDS if f not in payload]
    if missing:
        return f"Missing fields: {', '.join(missing)}"

    for field, (lo, hi) in _FIELD_RANGES.items():
        try:
            val = float(payload[field])
        except (TypeError, ValueError):
            return f"'{field}' must be a number"
        if not (lo <= val <= hi):
            return f"'{field}' must be between {lo} and {hi}, got {val}"

    return None


@predict_bp.route("/predict", methods=["POST"])
def predict():
    """
    Predict crime type from location and time features.

    Body:
        latitude    float  Chicago latitude  (41.6 – 42.1)
        longitude   float  Chicago longitude (-87.9 – -87.5)
        hour        int    0 – 23
        month       int    1 – 12
        day_of_week int    0 (Mon) – 6 (Sun)
        is_weekend  int    0 or 1
        season      int    0 (Winter) – 3 (Fall)
    """
    payload = request.get_json(silent=True)
    if payload is None:
        return jsonify({"error": "Request body must be valid JSON"}), 400

    error = _validate(payload)
    if error:
        return jsonify({"error": error}), 422

    try:
        result = predict_crime_type(payload)
        return jsonify(result), 200
    except Exception as exc:
        return jsonify({"error": "Prediction failed", "detail": str(exc)}), 500
