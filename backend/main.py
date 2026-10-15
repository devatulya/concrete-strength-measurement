"""
FastAPI Application for Concrete Compressive Strength Prediction System.
"""

import sys
import os
import datetime
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError

# Ensure project root in sys.path
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from backend.config import CORS_ORIGINS
from backend.schemas import (
    ConcreteMixInput,
    PredictionResponse,
    HealthResponse,
    ModelInfoResponse,
    MetricsResponse
)
from backend.ml_service import ml_service


from fastapi.encoders import jsonable_encoder

# Initial load on import (ensures test runners have model loaded even without lifespan context manager)
ml_service.load_model()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load trained ML model artifact once during application startup."""
    print("[FastAPI Startup] Initializing ML Service...")
    ml_service.load_model()
    if ml_service.is_model_loaded:
        print(f"[FastAPI Startup] Ready with model: {ml_service.model_name} (v{ml_service.model_version})")
    else:
        print("[FastAPI Startup] Warning: Model artifact not loaded yet. Predictions will require training first.")
    yield
    print("[FastAPI Shutdown] Cleaning up resources...")


app = FastAPI(
    title="Concrete Compressive Strength Predictor API",
    description="Machine Learning REST API for predicting concrete compressive strength (in MPa) based on mix design and curing age.",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS + ["*"],  # Permits local dev and preview ports
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Formats validation errors into clear, civil-engineering friendly messages."""
    error_messages = []
    formatted_errors = []

    for err in exc.errors():
        loc = " -> ".join([str(l) for l in err.get("loc", []) if l != "body"])
        msg = err.get("msg", "Invalid value")
        error_messages.append(f"{loc}: {msg}" if loc else msg)
        
        # Clean error dict so it is always JSON serializable
        clean_err = {
            "type": err.get("type", "value_error"),
            "loc": err.get("loc", []),
            "msg": msg
        }
        formatted_errors.append(clean_err)

    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "error": "Mix Specification Validation Error",
            "message": "; ".join(error_messages),
            "details": formatted_errors
        }
    )


@app.exception_handler(ValueError)
async def value_error_handler(request: Request, exc: ValueError):
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={
            "error": "Invalid Concrete Mix Design",
            "message": str(exc)
        }
    )


@app.exception_handler(RuntimeError)
async def runtime_error_handler(request: Request, exc: RuntimeError):
    return JSONResponse(
        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        content={
            "error": "Model Unavailable",
            "message": str(exc)
        }
    )


@app.get("/health", response_model=HealthResponse, tags=["Monitoring"])
def health_check():
    """Health check endpoint reporting API and ML model loading state."""
    return HealthResponse(
        status="healthy",
        model_loaded=ml_service.is_model_loaded,
        model_name=ml_service.model_name if ml_service.is_model_loaded else None,
        model_version=ml_service.model_version if ml_service.is_model_loaded else None,
        timestamp=datetime.datetime.now(datetime.timezone.utc).isoformat()
    )


@app.get("/api/v1/model-info", response_model=ModelInfoResponse, tags=["Model"])
def get_model_info():
    """Returns metadata about the active ML model, features, and source dataset."""
    try:
        info = ml_service.get_model_info()
        return ModelInfoResponse(**info)
    except FileNotFoundError as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=str(e)
        )


@app.get("/api/v1/metrics", response_model=MetricsResponse, tags=["Model"])
def get_metrics():
    """
    Returns authentic training and held-out test evaluation metrics,
    model comparison scores, feature importances, and sample held-out points.
    """
    try:
        metrics = ml_service.get_metrics_data()
        return MetricsResponse(**metrics)
    except FileNotFoundError as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=str(e)
        )


@app.post("/api/v1/predict", response_model=PredictionResponse, tags=["Prediction"])
def predict_strength(mix: ConcreteMixInput):
    """
    Predicts concrete compressive strength (MPa) from mix proportions and curing age.
    Validates physical boundaries (non-negative, total binder > 0, water > 0).
    Computes water-to-binder ratio and mix density.
    """
    try:
        prediction = ml_service.predict(mix)
        return prediction
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except RuntimeError as e:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Prediction error: {str(e)}")
