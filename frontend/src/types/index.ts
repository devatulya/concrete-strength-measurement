export interface ConcreteMixInput {
  cement: number;
  slag: number;
  fly_ash: number;
  water: number;
  superplasticizer: number;
  coarse_aggregate: number;
  fine_aggregate: number;
  age: number;
}

export interface CalculatedMixProperties {
  total_binder_kg_m3: number;
  water_to_binder_ratio: number;
  total_aggregate_kg_m3: number;
  fine_to_total_aggregate_ratio: number;
  estimated_fresh_density_kg_m3: number;
}

export interface PredictionResponse {
  predicted_strength_mpa: number;
  model_name: string;
  model_version: string;
  prediction_timestamp: string;
  calculated_properties: CalculatedMixProperties;
  submitted_mix: Record<string, number>;
  disclaimer: string;
}

export interface ModelComparison {
  model_name: string;
  is_best: boolean;
  cv_r2: number;
  cv_rmse: number;
  test_r2: number;
  test_rmse: number;
  test_mae: number;
}

export interface HeldOutSample {
  id: number;
  actual: number;
  predicted: number;
  residual: number;
  age: number;
  cement: number;
  water: number;
}

export interface MetricsResponse {
  model_version: string;
  selected_model: string;
  selected_model_metrics: {
    test_r2: number;
    test_rmse: number;
    test_mae: number;
    cv_r2_mean: number;
    cv_rmse_mean: number;
  };
  model_comparisons: ModelComparison[];
  feature_importances: Record<string, number>;
  held_out_samples: HeldOutSample[];
  statistics: Record<string, Record<string, number>>;
}

export interface ModelInfoResponse {
  model_name: string;
  model_version: string;
  trained_timestamp: string;
  feature_names: string[];
  target_name: string;
  dataset_info: {
    source: string;
    donor: string;
    total_samples: number;
    train_samples: number;
    test_samples: number;
    test_ratio: number;
  };
  features_metadata: Record<string, any>;
}

export interface HealthResponse {
  status: string;
  model_loaded: boolean;
  model_name: string | null;
  model_version: string | null;
  timestamp: string;
}

export interface MixPreset {
  id: string;
  name: string;
  gradeAdvisory: string;
  description: string;
  mix: ConcreteMixInput;
}
