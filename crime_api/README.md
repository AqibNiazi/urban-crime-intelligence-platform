# Crime Analytics API

Flask REST API serving trained ML models for the AI-Based Crime Analytics & Prediction System.

## Project Structure

```
crime_api/
├── app.py                    # Application factory & entry point
├── config.py                 # Environment-based configuration
├── requirements.txt
├── .env.example
│
├── api/                      # Route blueprints (HTTP layer only)
│   ├── health.py             # GET  /api/v1/health
│   ├── predict.py            # POST /api/v1/predict
│   ├── nlp.py                # POST /api/v1/nlp-classify
│   ├── forecast.py           # GET  /api/v1/forecast
│   └── hotspot.py            # POST /api/v1/hotspot
│
├── services/                 # Business logic & ML inference
│   ├── model_registry.py     # Loads & exposes all .pkl models
│   ├── predictor.py          # XGBoost crime classification
│   ├── nlp_service.py        # TF-IDF + Logistic Regression
│   ├── forecast_service.py   # Prophet time-series forecasting
│   └── hotspot_service.py    # K-Means hotspot detection
│
└── models/                   # .pkl files (not committed to git)
    ├── xgb_crime_model.pkl
    ├── label_encoder.pkl
    ├── le_remap.pkl
    ├── nlp_model.pkl
    ├── tfidf_vectorizer.pkl
    ├── nlp_label_encoder.pkl
    ├── prophet_model.pkl
    └── kmeans_model.pkl
```

## Quickstart

```bash
# 1. Clone and enter the directory
git clone <your-repo-url>
cd crime_api

# 2. Create a virtual environment
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Set up environment variables
cp .env.example .env

# 5. Add your trained models
#    Download all .pkl files from your Kaggle output panel
#    and place them in the models/ directory

# 6. Run the development server
python app.py
```

The API will be live at `http://localhost:5000`.

---

## API Reference

All endpoints are prefixed with `/api/v1`.

---

### `GET /api/v1/health`

Checks that all models are loaded and the server is ready.

**Response `200`**
```json
{
  "status": "ok",
  "models": {
    "xgb_model": true,
    "nlp_model": true,
    "tfidf_vectorizer": true,
    "prophet_model": true,
    "kmeans_model": true
  }
}
```

---

### `POST /api/v1/predict`

Predicts crime type from location and time features using the XGBoost model.

**Request body**
```json
{
  "latitude":    41.8781,
  "longitude":  -87.6298,
  "hour":        14,
  "month":       7,
  "day_of_week": 2,
  "is_weekend":  0,
  "season":      2
}
```

| Field | Type | Range | Description |
|---|---|---|---|
| `latitude` | float | 41.6 – 42.1 | WGS-84 latitude (Chicago) |
| `longitude` | float | -87.9 – -87.5 | WGS-84 longitude (Chicago) |
| `hour` | int | 0 – 23 | Hour of day |
| `month` | int | 1 – 12 | Month of year |
| `day_of_week` | int | 0 – 6 | 0 = Monday, 6 = Sunday |
| `is_weekend` | int | 0 or 1 | 1 if Saturday or Sunday |
| `season` | int | 0 – 3 | 0=Winter, 1=Spring, 2=Summer, 3=Fall |

**Response `200`**
```json
{
  "predicted_crime": "THEFT",
  "crime_label": 4,
  "top_3": [
    { "crime": "THEFT",   "probability": 0.4231 },
    { "crime": "BATTERY", "probability": 0.1802 },
    { "crime": "ASSAULT", "probability": 0.1124 }
  ]
}
```

---

### `POST /api/v1/nlp-classify`

Classifies a free-text crime description using TF-IDF + Logistic Regression.

**Request body**
```json
{
  "description": "retail theft from store, shoplifting merchandise"
}
```

**Response `200`**
```json
{
  "predicted_crime": "THEFT",
  "confidence": 0.8741,
  "top_3": [
    { "crime": "THEFT",   "confidence": 0.8741 },
    { "crime": "ROBBERY", "confidence": 0.0732 },
    { "crime": "BURGLARY","confidence": 0.0312 }
  ]
}
```

---

### `GET /api/v1/forecast?days=30`

Returns a daily crime count forecast using the trained Prophet model.

**Query parameters**

| Param | Type | Default | Description |
|---|---|---|---|
| `days` | int | 30 | Days to forecast (max 90) |

**Response `200`**
```json
{
  "days": 30,
  "forecast": [
    {
      "date": "2024-08-01",
      "predicted": 823.4,
      "lower_bound": 741.2,
      "upper_bound": 905.6
    }
  ]
}
```

---

### `POST /api/v1/hotspot`

Assigns a lat/lon point to its nearest K-Means crime cluster and returns a risk level.

**Request body**
```json
{
  "latitude":  41.8781,
  "longitude": -87.6298
}
```

**Response `200`**
```json
{
  "cluster_id": 3,
  "cluster_center": {
    "latitude":  41.871043,
    "longitude": -87.634211
  },
  "distance_km": 0.342,
  "risk_level": "high"
}
```

Risk levels: `high` (< 0.5 km from centre), `medium` (< 1.5 km), `low` (≥ 1.5 km).

---

## Error Responses

All errors follow the same shape:

```json
{
  "error": "Human-readable message",
  "detail": "Optional technical detail"
}
```

| Code | Meaning |
|---|---|
| `400` | Request body is not valid JSON |
| `422` | Missing or out-of-range fields |
| `500` | Internal inference error |
| `503` | One or more models failed to load |

---

## Production Deployment

```bash
pip install gunicorn
gunicorn "app:create_app()" --bind 0.0.0.0:5000 --workers 2
```

For Docker deployment, a `Dockerfile` can be added with the base image `python:3.11-slim`.
