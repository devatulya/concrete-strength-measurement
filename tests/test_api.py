"""
Integration and validation tests for the FastAPI backend endpoints.
"""

import pytest
from fastapi.testclient import TestClient
from backend.main import app
from backend.ml_service import ml_service

client = TestClient(app)


def test_health_endpoint():
    """Verify health endpoint returns 200 and reports model status."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["model_loaded"] is True
    assert data["model_name"] in ["Extra Trees", "HistGradientBoosting"]


def test_model_info_endpoint():
    """Verify model metadata endpoint."""
    response = client.get("/api/v1/model-info")
    assert response.status_code == 200
    data = response.json()
    assert data["model_name"] in ["Extra Trees", "HistGradientBoosting"]
    assert len(data["feature_names"]) == 8
    assert "dataset_info" in data


def test_metrics_endpoint():
    """Verify metrics endpoint returns genuine comparison metrics and held-out points."""
    response = client.get("/api/v1/metrics")
    assert response.status_code == 200
    data = response.json()
    assert data["selected_model"] in ["Extra Trees", "HistGradientBoosting"]
    assert "model_comparisons" in data
    assert len(data["model_comparisons"]) == 4
    assert "held_out_samples" in data
    assert len(data["held_out_samples"]) > 0


def test_predict_valid_standard_mix():
    """Verify prediction with standard realistic concrete mix."""
    payload = {
        "cement": 380.0,
        "slag": 0.0,
        "fly_ash": 0.0,
        "water": 180.0,
        "superplasticizer": 2.5,
        "coarse_aggregate": 1050.0,
        "fine_aggregate": 750.0,
        "age": 28.0
    }
    response = client.post("/api/v1/predict", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "predicted_strength_mpa" in data
    assert data["predicted_strength_mpa"] > 10.0
    assert "calculated_properties" in data

    props = data["calculated_properties"]
    assert props["total_binder_kg_m3"] == 380.0
    # w/b ratio = 180 / 380 = ~0.474
    assert abs(props["water_to_binder_ratio"] - (180.0 / 380.0)) < 0.01
    assert "disclaimer" in data


def test_predict_rejects_zero_binder():
    """Ensure API rejects mix with 0 cementitious binder."""
    payload = {
        "cement": 0.0,
        "slag": 0.0,
        "fly_ash": 0.0,
        "water": 180.0,
        "superplasticizer": 2.5,
        "coarse_aggregate": 1050.0,
        "fine_aggregate": 750.0,
        "age": 28.0
    }
    response = client.post("/api/v1/predict", json=payload)
    assert response.status_code in [400, 422]
    error_msg = response.text.lower()
    assert "binder" in error_msg


def test_predict_rejects_negative_values():
    """Ensure API rejects negative inputs."""
    payload = {
        "cement": -100.0,
        "slag": 0.0,
        "fly_ash": 0.0,
        "water": 180.0,
        "superplasticizer": 2.5,
        "coarse_aggregate": 1050.0,
        "fine_aggregate": 750.0,
        "age": 28.0
    }
    response = client.post("/api/v1/predict", json=payload)
    assert response.status_code in [400, 422]


def test_predict_rejects_invalid_age():
    """Ensure API rejects curing age out of supported bounds."""
    payload = {
        "cement": 350.0,
        "slag": 0.0,
        "fly_ash": 0.0,
        "water": 180.0,
        "superplasticizer": 2.5,
        "coarse_aggregate": 1050.0,
        "fine_aggregate": 750.0,
        "age": 400.0  # > 365
    }
    response = client.post("/api/v1/predict", json=payload)
    assert response.status_code in [400, 422]


def test_predict_missing_model_handling(monkeypatch):
    """Ensure API returns 503 if model is not loaded."""
    original_pkg = ml_service._model_package
    try:
        ml_service._model_package = None
        # Mock load_model to do nothing
        monkeypatch.setattr(ml_service, "load_model", lambda: None)
        
        payload = {
            "cement": 350.0,
            "slag": 0.0,
            "fly_ash": 0.0,
            "water": 180.0,
            "superplasticizer": 2.5,
            "coarse_aggregate": 1050.0,
            "fine_aggregate": 750.0,
            "age": 28.0
        }
        response = client.post("/api/v1/predict", json=payload)
        assert response.status_code == 503
        assert "not available" in response.text.lower()
    finally:
        ml_service._model_package = original_pkg
