"""
Forecast service — wraps the trained Prophet time-series model.

Responsible for:
  - Generating future date ranges
  - Running Prophet predict
  - Serialising the forecast to a JSON-friendly list
"""

from services.model_registry import registry

_MAX_DAYS = 90
_MIN_DAYS = 1


def get_crime_forecast(days: int = 30) -> dict:
    """
    Generate a daily crime count forecast.

    Args:
        days: number of future days to forecast (clamped to 1–90)

    Returns:
        {
            "days": 30,
            "forecast": [
                {
                    "date": "2024-08-01",
                    "predicted": 823.4,
                    "lower_bound": 741.2,
                    "upper_bound": 905.6
                },
                ...
            ]
        }
    """
    days = max(_MIN_DAYS, min(days, _MAX_DAYS))

    future = registry.prophet_model.make_future_dataframe(periods=days, freq="D")
    forecast = registry.prophet_model.predict(future)

    future_rows = forecast.tail(days)[["ds", "yhat", "yhat_lower", "yhat_upper"]]

    result = [
        {
            "date": row["ds"].strftime("%Y-%m-%d"),
            "predicted": round(float(row["yhat"]), 1),
            "lower_bound": round(float(row["yhat_lower"]), 1),
            "upper_bound": round(float(row["yhat_upper"]), 1),
        }
        for _, row in future_rows.iterrows()
    ]

    return {"days": days, "forecast": result}
