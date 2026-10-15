"""
Unit tests for Machine Learning Pipeline, Data Loader, and Serialization.
"""

import os
import pytest
import pandas as pd
import numpy as np
import joblib

from ml.data_loader import load_concrete_data, FEATURE_NAMES, TARGET_NAME
from backend.config import MODEL_PATH, METRICS_PATH, HELD_OUT_PATH


def test_data_loader_structure():
    """Verifies that the dataset loads properly with 8 features and target."""
    X, y, metadata = load_concrete_data()
    assert isinstance(X, pd.DataFrame)
    assert isinstance(y, pd.Series)
    assert len(X) >= 1030
    assert len(y) >= 1030
    assert list(X.columns) == FEATURE_NAMES
    assert y.name == TARGET_NAME
    assert not X.isnull().any().any()
    assert not y.isnull().any()
    assert metadata["total_records"] >= 1030
    assert len(metadata["feature_names"]) == 8


def test_model_artifact_integrity():
    """Verifies that the saved model artifact contains all required attributes."""
    assert os.path.exists(MODEL_PATH), "Model artifact does not exist. Run ml/train.py first."
    pkg = joblib.load(MODEL_PATH)
    assert "model" in pkg
    assert "model_name" in pkg
    assert "version" in pkg
    assert "feature_names" in pkg
    assert pkg["feature_names"] == FEATURE_NAMES
    assert hasattr(pkg["model"], "predict")


def test_metrics_json_integrity():
    """Verifies that the metrics summary contains genuine comparisons for 4 models."""
    assert os.path.exists(METRICS_PATH), "Metrics file does not exist."
    import json
    with open(METRICS_PATH, "r") as f:
        metrics = json.load(f)

    assert "selected_model" in metrics
    assert "selected_model_metrics" in metrics
    assert "model_comparisons" in metrics
    assert len(metrics["model_comparisons"]) == 4

    candidate_names = [m["model_name"] for m in metrics["model_comparisons"]]
    assert "Linear Regression" in candidate_names
    assert "Random Forest" in candidate_names
    assert "Extra Trees" in candidate_names
    assert "HistGradientBoosting" in candidate_names

    best_count = sum(1 for m in metrics["model_comparisons"] if m["is_best"])
    assert best_count == 1

    # Check metrics are non-trivial positive numbers
    assert 0.0 < metrics["selected_model_metrics"]["test_r2"] <= 1.0
    assert metrics["selected_model_metrics"]["test_rmse"] > 0.0
    assert metrics["selected_model_metrics"]["test_mae"] > 0.0


def test_model_inference_prediction():
    """Verifies that the model generates reasonable compressive strength for typical mix."""
    pkg = joblib.load(MODEL_PATH)
    model = pkg["model"]

    # Standard M25 mix approx: Cement 350, Slag 0, Fly Ash 0, Water 180, SP 2, CA 1050, FA 750, Age 28
    sample_df = pd.DataFrame([{
        "cement": 350.0,
        "slag": 0.0,
        "fly_ash": 0.0,
        "water": 180.0,
        "superplasticizer": 2.0,
        "coarse_aggregate": 1050.0,
        "fine_aggregate": 750.0,
        "age": 28.0
    }])[FEATURE_NAMES]

    pred = model.predict(sample_df)[0]
    assert isinstance(pred, (float, np.floating))
    # Compressive strength for standard 28d concrete typically falls between 15 and 80 MPa
    assert 15.0 < pred < 85.0
