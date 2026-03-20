"""
Model registry — loads every .pkl file once at application startup
and exposes them as a singleton so routes never deal with file I/O.
"""

import os
import logging
import joblib

logger = logging.getLogger(__name__)


class ModelRegistry:
    """
    Loads and holds all trained models.

    Usage:
        registry = ModelRegistry("models/")
        registry.load()
        model = registry.xgb_model
    """

    _REQUIRED_FILES = {
        "xgb_model": "xgb_crime_model.pkl",
        "label_encoder": "label_encoder.pkl",
        "le_remap": "le_remap.pkl",
        "nlp_model": "nlp_model.pkl",
        "tfidf_vectorizer": "tfidf_vectorizer.pkl",
        "nlp_label_encoder": "nlp_label_encoder.pkl",
        "prophet_model": "prophet_model.pkl",
        "kmeans_model": "kmeans_model.pkl",
    }

    def __init__(self, model_dir: str):
        self.model_dir = model_dir
        self._models: dict = {}
        self.crime_names: list = []

    # ------------------------------------------------------------------
    # Public interface
    # ------------------------------------------------------------------

    def load(self) -> None:
        """Load all models from disk. Raises FileNotFoundError on missing files."""
        logger.info("Loading models from: %s", self.model_dir)

        for attr, filename in self._REQUIRED_FILES.items():
            path = os.path.join(self.model_dir, filename)
            if not os.path.exists(path):
                raise FileNotFoundError(
                    f"Required model file not found: '{path}'. "
                    "Download it from your Kaggle output and place it in the models/ directory."
                )
            self._models[attr] = joblib.load(path)
            logger.info("  loaded %-25s <- %s", attr, filename)

        # Pre-build crime name list once so prediction routes can just index it
        self.crime_names = (
            self._models["label_encoder"].classes_[
                self._models["le_remap"].classes_
            ].tolist()
        )

        logger.info("All models loaded. %d crime classes found.", len(self.crime_names))

    def is_ready(self) -> bool:
        return len(self._models) == len(self._REQUIRED_FILES)

    def status(self) -> dict:
        return {attr: (attr in self._models) for attr in self._REQUIRED_FILES}

    # ------------------------------------------------------------------
    # Model accessors — typed properties keep IDE auto-complete working
    # ------------------------------------------------------------------

    def __getattr__(self, name):
        if name.startswith("_") or name not in self._REQUIRED_FILES:
            raise AttributeError(name)
        if name not in self._models:
            raise RuntimeError(f"Model '{name}' is not loaded. Call .load() first.")
        return self._models[name]


# Module-level singleton — imported by services and the app factory
registry = ModelRegistry(
    model_dir=os.getenv("MODEL_DIR", "models")
)
