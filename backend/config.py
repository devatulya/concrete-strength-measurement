"""
Application configuration and path settings.
"""

import os
from typing import List

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
MODEL_PATH = os.getenv(
    "CONCRETE_MODEL_PATH",
    os.path.join(BASE_DIR, "ml", "models", "concrete_model.joblib")
)
METRICS_PATH = os.getenv(
    "CONCRETE_METRICS_PATH",
    os.path.join(BASE_DIR, "ml", "artifacts", "metrics.json")
)
HELD_OUT_PATH = os.getenv(
    "CONCRETE_HELD_OUT_PATH",
    os.path.join(BASE_DIR, "ml", "artifacts", "held_out_predictions.json")
)

CORS_ORIGINS: List[str] = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:4173",
    "http://127.0.0.1:4173",
]
