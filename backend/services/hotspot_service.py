"""
Hotspot service — wraps the K-Means clustering model.

Responsible for:
  - Assigning a lat/lon point to its nearest crime cluster
  - Computing distance to the cluster centre
  - Deriving a human-readable risk level
"""

import math
import numpy as np
from services.model_registry import registry

# Approximate degree-to-km conversion at Chicago's latitude (~41.8°N)
# 1° latitude  ≈ 111 km
# 1° longitude ≈ 82 km  (111 * cos(41.8°))
_KM_PER_DEG_LAT = 111.0
_KM_PER_DEG_LON = 82.0

_RISK_THRESHOLDS = {
    "high": 0.5,    # km
    "medium": 1.5,  # km
}


def _distance_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Euclidean distance in km (good enough for small Chicago-scale distances)."""
    dlat = (lat1 - lat2) * _KM_PER_DEG_LAT
    dlon = (lon1 - lon2) * _KM_PER_DEG_LON
    return math.sqrt(dlat**2 + dlon**2)


def _risk_level(distance_km: float) -> str:
    if distance_km <= _RISK_THRESHOLDS["high"]:
        return "high"
    if distance_km <= _RISK_THRESHOLDS["medium"]:
        return "medium"
    return "low"


def get_hotspot(latitude: float, longitude: float) -> dict:
    """
    Assign a geographic point to its nearest crime hotspot cluster.

    Args:
        latitude:  WGS-84 latitude
        longitude: WGS-84 longitude

    Returns:
        {
            "cluster_id": 3,
            "cluster_center": {"latitude": 41.871, "longitude": -87.634},
            "distance_km": 0.34,
            "risk_level": "high"
        }
    """
    coords = np.array([[latitude, longitude]])
    cluster_id = int(registry.kmeans_model.predict(coords)[0])
    center = registry.kmeans_model.cluster_centers_[cluster_id]

    dist = _distance_km(latitude, longitude, float(center[0]), float(center[1]))

    return {
        "cluster_id": cluster_id,
        "cluster_center": {
            "latitude": round(float(center[0]), 6),
            "longitude": round(float(center[1]), 6),
        },
        "distance_km": round(dist, 3),
        "risk_level": _risk_level(dist),
    }
