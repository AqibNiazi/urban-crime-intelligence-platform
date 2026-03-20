"""
NLP service — wraps the TF-IDF vectorizer + Logistic Regression classifier.

Responsible for:
  - Normalising raw description text
  - Vectorising with TF-IDF
  - Running inference and decoding the label
"""

from services.model_registry import registry


def _normalise(text: str) -> str:
    return text.strip().lower()


def classify_description(description: str) -> dict:
    """
    Classify a free-text crime description into a crime category.

    Args:
        description: raw text from the request (e.g. "shoplifting from store")

    Returns:
        {
            "predicted_crime": "THEFT",
            "confidence": 0.87,
            "top_3": [{"crime": ..., "confidence": ...}, ...]
        }
    """
    normalised = _normalise(description)
    X = registry.tfidf_vectorizer.transform([normalised])

    pred_label = int(registry.nlp_model.predict(X)[0])
    pred_proba = registry.nlp_model.predict_proba(X)[0]
    pred_crime = registry.nlp_label_encoder.inverse_transform([pred_label])[0]

    top3_indices = pred_proba.argsort()[::-1][:3]
    top3 = [
        {
            "crime": registry.nlp_label_encoder.inverse_transform([i])[0],
            "confidence": round(float(pred_proba[i]), 4),
        }
        for i in top3_indices
    ]

    return {
        "predicted_crime": pred_crime,
        "confidence": round(float(pred_proba.max()), 4),
        "top_3": top3,
    }
