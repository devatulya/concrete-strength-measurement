"""
Pydantic schemas for request validation and API responses.
"""

from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field, model_validator


class ConcreteMixInput(BaseModel):
    cement: float = Field(..., ge=0.0, description="Ordinary Portland cement content in kg/m³")
    slag: float = Field(default=0.0, ge=0.0, description="Blast furnace slag (GGBS) content in kg/m³")
    fly_ash: float = Field(default=0.0, ge=0.0, description="Fly ash pozzolanic binder in kg/m³")
    water: float = Field(..., gt=0.0, description="Batch water in kg/m³")
    superplasticizer: float = Field(default=0.0, ge=0.0, description="Superplasticizer chemical admixture in kg/m³")
    coarse_aggregate: float = Field(..., gt=0.0, description="Coarse aggregate (gravel/crushed stone) in kg/m³")
    fine_aggregate: float = Field(..., gt=0.0, description="Fine aggregate (sand) in kg/m³")
    age: float = Field(..., ge=1.0, le=365.0, description="Curing age in days (1 to 365)")

    @model_validator(mode="after")
    def validate_binder_and_water(self) -> "ConcreteMixInput":
        total_binder = self.cement + self.slag + self.fly_ash
        if total_binder <= 0:
            raise ValueError(
                "Total binder content (cement + slag + fly ash) must be greater than 0 kg/m³. "
                "Concrete requires cementitious material to hydrate and gain strength."
            )
        if self.water <= 0:
            raise ValueError("Water content must be strictly positive (> 0 kg/m³).")
        return self

    model_config = {
        "json_schema_extra": {
            "example": {
                "cement": 350.0,
                "slag": 0.0,
                "fly_ash": 0.0,
                "water": 185.0,
                "superplasticizer": 2.5,
                "coarse_aggregate": 1050.0,
                "fine_aggregate": 750.0,
                "age": 28.0
            }
        }
    }


class CalculatedMixProperties(BaseModel):
    total_binder_kg_m3: float = Field(..., description="Total cementitious binder (cement + slag + fly ash)")
    water_to_binder_ratio: float = Field(..., description="Water-to-binder ratio (w/b)")
    total_aggregate_kg_m3: float = Field(..., description="Total coarse and fine aggregate")
    fine_to_total_aggregate_ratio: float = Field(..., description="Ratio of fine aggregate to total aggregate")
    estimated_fresh_density_kg_m3: float = Field(..., description="Sum of all mix components")


class PredictionResponse(BaseModel):
    predicted_strength_mpa: float = Field(..., description="Predicted 150mm cube compressive strength in MPa")
    model_name: str
    model_version: str
    prediction_timestamp: str
    calculated_properties: CalculatedMixProperties
    submitted_mix: Dict[str, float]
    disclaimer: str


class HealthResponse(BaseModel):
    status: str
    model_loaded: bool
    model_name: Optional[str] = None
    model_version: Optional[str] = None
    timestamp: str


class ModelInfoResponse(BaseModel):
    model_name: str
    model_version: str
    trained_timestamp: str
    feature_names: List[str]
    target_name: str
    dataset_info: Dict[str, Any]
    features_metadata: Dict[str, Any]


class MetricsResponse(BaseModel):
    model_version: str
    selected_model: str
    selected_model_metrics: Dict[str, float]
    model_comparisons: List[Dict[str, Any]]
    feature_importances: Dict[str, float]
    held_out_samples: List[Dict[str, Any]]
    statistics: Dict[str, Any]
