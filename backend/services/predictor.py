"""
Predictor service — wraps the XGBoost classifier.

Responsible for:
  - Building the feature vector from request data
  - Running inference
  - Formatting the prediction result
"""

import numpy as np
from services.model_registry import registry


def build_feature_vector(payload: dict) -> np.ndarray:
    """
    Construct the (1, 7) feature array expected by the XGBoost model.

    Feature order must match training:
        [Latitude, Longitude, Hour, Month, DayOfWeek, IsWeekend, Season]
    """
    return np.array([[
        float(payload["latitude"]),
        float(payload["longitude"]),
        int(payload["hour"]),
        int(payload["month"]),
        int(payload["day_of_week"]),
        int(payload["is_weekend"]),
        int(payload["season"]),
    ]])


def predict_crime_type(payload: dict) -> dict:
    """
    Predict the most likely crime type and return top-3 probabilities.

    Args:
        payload: validated request dict with location and time fields

    Returns:
        {
            "predicted_crime": "THEFT",
            "crime_label": 4,
            "top_3": [{"crime": ..., "probability": ...}, ...]
        }
    """
    features = build_feature_vector(payload)

    predicted_label = int(registry.xgb_model.predict(features)[0])
    predicted_crime = registry.crime_names[predicted_label]

    probabilities = registry.xgb_model.predict_proba(features)[0]
    top3_indices = probabilities.argsort()[::-1][:3]

    top3 = [
        {
            "crime": registry.crime_names[i],
            "probability": round(float(probabilities[i]), 4),
        }
        for i in top3_indices
    ]

    return {
        "predicted_crime": predicted_crime,
        "crime_label": predicted_label,
        "top_3": top3,
    }
