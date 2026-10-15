"""
Data loading, validation, and schema definitions for the Concrete Strength Dataset.
"""

import os
from typing import Tuple, Dict, Any, List
import pandas as pd
import numpy as np

DATA_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "data"))
CSV_PATH = os.path.join(DATA_DIR, "concrete_data.csv")
XLS_PATH = os.path.join(DATA_DIR, "Concrete_Data.xls")

FEATURE_NAMES: List[str] = [
    "cement",
    "slag",
    "fly_ash",
    "water",
    "superplasticizer",
    "coarse_aggregate",
    "fine_aggregate",
    "age"
]

TARGET_NAME: str = "compressive_strength"

FEATURE_METADATA: Dict[str, Dict[str, Any]] = {
    "cement": {
        "label": "Cement",
        "unit": "kg/m³",
        "category": "cementitious",
        "min": 100.0,
        "max": 550.0,
        "step": 1.0,
        "description": "Ordinary Portland Cement (OPC) content per cubic meter."
    },
    "slag": {
        "label": "Blast Furnace Slag",
        "unit": "kg/m³",
        "category": "cementitious",
        "min": 0.0,
        "max": 360.0,
        "step": 1.0,
        "description": "Ground granulated blast-furnace slag (GGBS), supplementary cementitious material."
    },
    "fly_ash": {
        "label": "Fly Ash",
        "unit": "kg/m³",
        "category": "cementitious",
        "min": 0.0,
        "max": 210.0,
        "step": 1.0,
        "description": "Pulverized fuel ash (class F or C pozzolan) replacing cement."
    },
    "water": {
        "label": "Water",
        "unit": "kg/m³",
        "category": "water_admixture",
        "min": 120.0,
        "max": 250.0,
        "step": 0.5,
        "description": "Total effective batch water per cubic meter of concrete."
    },
    "superplasticizer": {
        "label": "Superplasticizer",
        "unit": "kg/m³",
        "category": "water_admixture",
        "min": 0.0,
        "max": 35.0,
        "step": 0.1,
        "description": "High-range water-reducing admixture (HRWR) for rheology & workability."
    },
    "coarse_aggregate": {
        "label": "Coarse Aggregate",
        "unit": "kg/m³",
        "category": "aggregates",
        "min": 800.0,
        "max": 1200.0,
        "step": 5.0,
        "description": "Crushed stone or gravel (nominal maximum aggregate size typically 20 mm)."
    },
    "fine_aggregate": {
        "label": "Fine Aggregate",
        "unit": "kg/m³",
        "category": "aggregates",
        "min": 590.0,
        "max": 1000.0,
        "step": 5.0,
        "description": "River sand or manufactured fine aggregate (passing 4.75 mm sieve)."
    },
    "age": {
        "label": "Curing Age",
        "unit": "days",
        "category": "curing",
        "min": 1,
        "max": 365,
        "step": 1,
        "description": "Age of specimen under standard moisture curing (typically 3, 7, 14, 28, 56, 90, or 365 days)."
    }
}


def load_concrete_data() -> Tuple[pd.DataFrame, pd.Series, Dict[str, Any]]:
    """
    Loads and validates the concrete dataset.
    Returns:
        X (DataFrame): Features in standard order.
        y (Series): Compressive strength target in MPa.
        metadata (dict): Summary statistics and dataset info.
    """
    if os.path.exists(CSV_PATH):
        df = pd.read_csv(CSV_PATH)
    elif os.path.exists(XLS_PATH):
        df = pd.read_excel(XLS_PATH)
        # Rename if raw XLS
        if len(df.columns) == 9 and df.columns[0] != "cement":
            df.columns = FEATURE_NAMES + [TARGET_NAME]
    else:
        raise FileNotFoundError(
            f"Dataset not found at {CSV_PATH} or {XLS_PATH}. "
            f"Please run 'python ml/download_data.py' to download the authentic UCI dataset."
        )

    # Validate columns
    for feat in FEATURE_NAMES:
        if feat not in df.columns:
            raise ValueError(f"Required feature '{feat}' missing from dataset.")
    if TARGET_NAME not in df.columns:
        raise ValueError(f"Target column '{TARGET_NAME}' missing from dataset.")

    # Check missing values
    null_counts = df[FEATURE_NAMES + [TARGET_NAME]].isnull().sum()
    if null_counts.any():
        print(f"Warning: dropping {null_counts.sum()} rows with missing values.")
        df = df.dropna(subset=FEATURE_NAMES + [TARGET_NAME])

    # Convert to numeric
    for col in FEATURE_NAMES + [TARGET_NAME]:
        df[col] = pd.to_numeric(df[col], errors="raise")

    X = df[FEATURE_NAMES].copy()
    y = df[TARGET_NAME].copy()

    # Metadata extraction
    stats = {}
    for col in FEATURE_NAMES + [TARGET_NAME]:
        stats[col] = {
            "min": float(df[col].min()),
            "max": float(df[col].max()),
            "mean": float(df[col].mean()),
            "std": float(df[col].std()),
            "median": float(df[col].median()),
            "q25": float(df[col].quantile(0.25)),
            "q75": float(df[col].quantile(0.75))
        }

    metadata = {
        "total_records": int(len(df)),
        "feature_names": FEATURE_NAMES,
        "target_name": TARGET_NAME,
        "features_metadata": FEATURE_METADATA,
        "statistics": stats
    }

    return X, y, metadata
