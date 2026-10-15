"""
Reproducible training and evaluation pipeline for Concrete Compressive Strength Prediction.
Evaluates Linear Regression, Random Forest, Extra Trees, and HistGradientBoosting.
Selects the top-performing model via 5-Fold Cross-Validation on training data only.
Evaluates on the held-out test set, exports metrics, plots, and serializes the winning model.
"""

import os
import sys
import json
import datetime

# Ensure project root is in sys.path
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)
from typing import Dict, Any
import numpy as np
import pandas as pd
import joblib
import matplotlib.pyplot as plt

from sklearn.model_selection import train_test_split, KFold, cross_validate
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import (
    RandomForestRegressor,
    ExtraTreesRegressor,
    HistGradientBoostingRegressor
)
from sklearn.metrics import (
    mean_absolute_error,
    root_mean_squared_error,
    r2_score
)

from ml.data_loader import (
    load_concrete_data,
    FEATURE_NAMES,
    TARGET_NAME,
    FEATURE_METADATA
)

RANDOM_SEED = 42
TEST_SIZE = 0.20
MODEL_VERSION = "1.0.0"

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
MODELS_DIR = os.path.join(BASE_DIR, "ml", "models")
ARTIFACTS_DIR = os.path.join(BASE_DIR, "ml", "artifacts")
REPORTS_DIR = os.path.join(BASE_DIR, "reports")


def get_candidate_models() -> Dict[str, Any]:
    """Defines the 4 candidate regression models."""
    return {
        "Linear Regression": Pipeline([
            ("scaler", StandardScaler()),
            ("regressor", LinearRegression())
        ]),
        "Random Forest": RandomForestRegressor(
            n_estimators=150,
            max_depth=16,
            min_samples_split=3,
            random_state=RANDOM_SEED,
            n_jobs=-1
        ),
        "Extra Trees": ExtraTreesRegressor(
            n_estimators=150,
            max_depth=18,
            min_samples_split=2,
            random_state=RANDOM_SEED,
            n_jobs=-1
        ),
        "HistGradientBoosting": HistGradientBoostingRegressor(
            max_iter=150,
            max_depth=8,
            learning_rate=0.08,
            random_state=RANDOM_SEED
        )
    }


def train_and_evaluate():
    os.makedirs(MODELS_DIR, exist_ok=True)
    os.makedirs(ARTIFACTS_DIR, exist_ok=True)
    os.makedirs(REPORTS_DIR, exist_ok=True)

    print("=" * 70)
    print("CONCRETE COMPRESSIVE STRENGTH PREDICTION - MODEL TRAINING PIPELINE")
    print("=" * 70)

    # 1. Load Data
    X, y, metadata = load_concrete_data()
    print(f"Loaded dataset: {len(X)} records with 8 features.")

    # 2. Train/Test Split (Held-out test set strictly isolated)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y,
        test_size=TEST_SIZE,
        random_state=RANDOM_SEED
    )
    print(f"Train split: {len(X_train)} samples | Held-out test split: {len(X_test)} samples")

    candidate_models = get_candidate_models()
    cv = KFold(n_splits=5, shuffle=True, random_state=RANDOM_SEED)

    print("\n--- 5-Fold Cross-Validation (Training Set Only) ---")
    cv_results = {}
    fitted_models = {}

    for name, model in candidate_models.items():
        # Evaluate using CV on training partition ONLY
        cv_scores = cross_validate(
            model,
            X_train,
            y_train,
            cv=cv,
            scoring={
                "r2": "r2",
                "neg_rmse": "neg_root_mean_squared_error",
                "neg_mae": "neg_mean_absolute_error"
            },
            n_jobs=-1
        )
        mean_cv_r2 = float(np.mean(cv_scores["test_r2"]))
        std_cv_r2 = float(np.std(cv_scores["test_r2"]))
        mean_cv_rmse = float(-np.mean(cv_scores["test_rmse" if "test_rmse" in cv_scores else "test_neg_rmse"]))
        mean_cv_mae = float(-np.mean(cv_scores["test_mae" if "test_mae" in cv_scores else "test_neg_mae"]))

        cv_results[name] = {
            "cv_r2_mean": round(mean_cv_r2, 4),
            "cv_r2_std": round(std_cv_r2, 4),
            "cv_rmse_mean": round(mean_cv_rmse, 4),
            "cv_mae_mean": round(mean_cv_mae, 4)
        }
        print(f"{name:<22}: CV R2 = {mean_cv_r2:.4f} (+/- {std_cv_r2:.4f}) | CV RMSE = {mean_cv_rmse:.4f} MPa")

        # Fit model on full training set
        model.fit(X_train, y_train)
        fitted_models[name] = model

    # 3. Select winning model based on CV R2
    best_model_name = max(cv_results, key=lambda k: cv_results[k]["cv_r2_mean"])
    print(f"\n[Selection] Best model selected by Cross-Validation: '{best_model_name}'")

    # 4. Evaluate all fitted models on held-out test set
    print("\n--- Held-Out Test Set Evaluation ---")
    model_comparisons = []
    test_predictions_dict = {}

    for name, model in fitted_models.items():
        y_pred = model.predict(X_test)
        test_predictions_dict[name] = y_pred

        mae = float(mean_absolute_error(y_test, y_pred))
        rmse = float(root_mean_squared_error(y_test, y_pred))
        r2 = float(r2_score(y_test, y_pred))

        model_comparisons.append({
            "model_name": name,
            "is_best": (name == best_model_name),
            "cv_r2": cv_results[name]["cv_r2_mean"],
            "cv_rmse": cv_results[name]["cv_rmse_mean"],
            "test_r2": round(r2, 4),
            "test_rmse": round(rmse, 4),
            "test_mae": round(mae, 4)
        })
        print(f"{name:<22}: Test R2 = {r2:.4f} | Test RMSE = {rmse:.4f} MPa | Test MAE = {mae:.4f} MPa")

    # Winning model test metrics
    best_model = fitted_models[best_model_name]
    best_y_pred = test_predictions_dict[best_model_name]
    best_mae = float(mean_absolute_error(y_test, best_y_pred))
    best_rmse = float(root_mean_squared_error(y_test, best_y_pred))
    best_r2 = float(r2_score(y_test, best_y_pred))

    # Feature Importance (if applicable)
    feature_importances = {}
    if hasattr(best_model, "feature_importances_"):
        for feat, imp in zip(FEATURE_NAMES, best_model.feature_importances_):
            feature_importances[feat] = round(float(imp), 4)
    elif hasattr(best_model, "named_steps") and hasattr(best_model.named_steps.get("regressor"), "coef_"):
        coefs = best_model.named_steps["regressor"].coef_
        for feat, c in zip(FEATURE_NAMES, coefs):
            feature_importances[feat] = round(float(abs(c)), 4)

    # 5. Build Held-Out Points Structure for Frontend Charts
    test_points = []
    residuals = y_test.values - best_y_pred
    for i in range(len(y_test)):
        row_features = {feat: float(X_test.iloc[i][feat]) for feat in FEATURE_NAMES}
        actual_val = float(y_test.iloc[i])
        pred_val = float(best_y_pred[i])
        res_val = float(residuals[i])
        test_points.append({
            "id": i + 1,
            "actual": round(actual_val, 2),
            "predicted": round(pred_val, 2),
            "residual": round(res_val, 2),
            "age": int(row_features["age"]),
            "cement": round(row_features["cement"], 1),
            "water": round(row_features["water"], 1)
        })

    # 6. Save Artifacts & Serialization
    metrics_summary = {
        "model_version": MODEL_VERSION,
        "selected_model": best_model_name,
        "trained_timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat(),
        "random_seed": RANDOM_SEED,
        "dataset_info": {
            "source": "UCI Machine Learning Repository (Concrete Compressive Strength)",
            "donor": "Prof. I-Cheng Yeh",
            "total_samples": len(X),
            "train_samples": len(X_train),
            "test_samples": len(X_test),
            "test_ratio": TEST_SIZE
        },
        "selected_model_metrics": {
            "test_r2": round(best_r2, 4),
            "test_rmse": round(best_rmse, 4),
            "test_mae": round(best_mae, 4),
            "cv_r2_mean": cv_results[best_model_name]["cv_r2_mean"],
            "cv_rmse_mean": cv_results[best_model_name]["cv_rmse_mean"]
        },
        "model_comparisons": model_comparisons,
        "feature_names": FEATURE_NAMES,
        "target_name": TARGET_NAME,
        "feature_importances": feature_importances,
        "features_metadata": FEATURE_METADATA,
        "statistics": metadata["statistics"]
    }

    metrics_path = os.path.join(ARTIFACTS_DIR, "metrics.json")
    with open(metrics_path, "w") as f:
        json.dump(metrics_summary, f, indent=2)
    print(f"\n[Saved] Metrics summary JSON -> {metrics_path}")

    held_out_path = os.path.join(ARTIFACTS_DIR, "held_out_predictions.json")
    with open(held_out_path, "w") as f:
        json.dump(test_points, f, indent=2)
    print(f"[Saved] Held-out predictions JSON -> {held_out_path}")

    # Save trained model pipeline with joblib
    model_save_path = os.path.join(MODELS_DIR, "concrete_model.joblib")
    model_package = {
        "model": best_model,
        "model_name": best_model_name,
        "version": MODEL_VERSION,
        "feature_names": FEATURE_NAMES,
        "target_name": TARGET_NAME,
        "metrics": metrics_summary["selected_model_metrics"],
        "trained_at": metrics_summary["trained_timestamp"]
    }
    joblib.dump(model_package, model_save_path)
    print(f"[Saved] Trained model artifact -> {model_save_path}")

    # 7. Generate Evaluation Plots
    print("\n--- Generating Evaluation Charts for Reports ---")
    generate_plots(y_test.values, best_y_pred, model_comparisons, best_model_name)

    print("=" * 70)
    print("TRAINING PIPELINE COMPLETE.")
    print("=" * 70)
    return metrics_summary


def generate_plots(y_true, y_pred, comparisons, best_name):
    # Style settings
    plt.style.use("seaborn-v0_8-whitegrid" if "seaborn-v0_8-whitegrid" in plt.style.available else "default")
    residuals = y_true - y_pred

    # 1. Actual vs Predicted Plot
    fig, ax = plt.subplots(figsize=(7, 6), dpi=150)
    ax.scatter(y_true, y_pred, color="#1e3a8a", alpha=0.7, edgecolors="white", s=45, label="Test Mixes")
    min_val = min(float(y_true.min()), float(y_pred.min())) - 2
    max_val = max(float(y_true.max()), float(y_pred.max())) + 2
    ax.plot([min_val, max_val], [min_val, max_val], color="#ef4444", linestyle="--", linewidth=2, label="Ideal Fit (y = x)")
    ax.set_title(f"Actual vs. Predicted Compressive Strength ({best_name})", fontsize=12, fontweight="bold", pad=12)
    ax.set_xlabel("Experimental Compressive Strength (MPa)", fontsize=10)
    ax.set_ylabel("Predicted Compressive Strength (MPa)", fontsize=10)
    ax.set_xlim(min_val, max_val)
    ax.set_ylim(min_val, max_val)
    ax.legend(frameon=True)
    plt.tight_layout()
    plot_path1 = os.path.join(REPORTS_DIR, "actual_vs_predicted.png")
    fig.savefig(plot_path1)
    plt.close(fig)
    print(f"  -> Generated {plot_path1}")

    # 2. Residual Plot
    fig, ax = plt.subplots(figsize=(7, 6), dpi=150)
    ax.scatter(y_pred, residuals, color="#0284c7", alpha=0.7, edgecolors="white", s=45)
    ax.axhline(0, color="#ef4444", linestyle="--", linewidth=1.5, label="Zero Error Line")
    ax.set_title(f"Residuals vs. Predicted Values ({best_name})", fontsize=12, fontweight="bold", pad=12)
    ax.set_xlabel("Predicted Compressive Strength (MPa)", fontsize=10)
    ax.set_ylabel("Residual (Actual - Predicted, MPa)", fontsize=10)
    ax.legend(frameon=True)
    plt.tight_layout()
    plot_path2 = os.path.join(REPORTS_DIR, "residual_plot.png")
    fig.savefig(plot_path2)
    plt.close(fig)
    print(f"  -> Generated {plot_path2}")

    # 3. Model Comparison Bar Chart
    df_comp = pd.DataFrame(comparisons)
    fig, ax = plt.subplots(figsize=(8, 5), dpi=150)
    x = np.arange(len(df_comp))
    width = 0.35
    ax.bar(x - width/2, df_comp["test_r2"], width, label="Test R²", color="#1e40af")
    ax.bar(x + width/2, df_comp["test_rmse"] / df_comp["test_rmse"].max(), width, label="Relative RMSE", color="#93c5fd")
    ax.set_xticks(x)
    ax.set_xticklabels(df_comp["model_name"], rotation=15, ha="right", fontsize=9)
    ax.set_title("Candidate Algorithm Performance Comparison", fontsize=12, fontweight="bold", pad=12)
    ax.set_ylabel("Score / Normalized Metric", fontsize=10)
    ax.set_ylim(0, 1.1)
    ax.legend(frameon=True)
    plt.tight_layout()
    plot_path3 = os.path.join(REPORTS_DIR, "model_comparison.png")
    fig.savefig(plot_path3)
    plt.close(fig)
    print(f"  -> Generated {plot_path3}")


if __name__ == "__main__":
    train_and_evaluate()
