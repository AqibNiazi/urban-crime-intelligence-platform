from flask import Blueprint, request, jsonify
from services.forecast_service import get_crime_forecast

forecast_bp = Blueprint("forecast", __name__)


@forecast_bp.route("/forecast", methods=["GET"])
def forecast():
    """
    Return a daily crime count forecast.

    Query params:
        days  int  Number of days to forecast (default 30, max 90)
    """
    raw_days = request.args.get("days", 30)
    try:
        days = int(raw_days)
    except (TypeError, ValueError):
        return jsonify({"error": "'days' must be an integer"}), 422

    try:
        result = get_crime_forecast(days=days)
        return jsonify(result), 200
    except Exception as exc:
        return jsonify({"error": "Forecasting failed", "detail": str(exc)}), 500
