---
title: Concrete Strength Predictor API
emoji: 🏗️
colorFrom: blue
colorTo: indigo
sdk: docker
app_port: 7860
---

# Concrete Strength Predictor (ConcreteIQ)
> **B.Tech 3rd Year Civil Engineering Project**  
> An end-to-end full-stack machine learning web application predicting concrete compressive strength ($f_c$ in MPa) from mix proportions and curing age using an authentic trained regression ensemble.

---

## 1. Executive Summary & Objective

In civil engineering materials practice, the characteristic compressive strength of concrete is the governing parameter for structural design (IS 456 / ACI 318 / BS EN 206). Traditionally, mix design follows empirical trial batching (IS 10262:2019, ACI 211.1) requiring extensive casting, 28-day moist curing, and destructive laboratory crushing tests.

**Concrete Strength Predictor** replaces arbitrary heuristics with a genuine, cross-validated ensemble machine-learning model trained on an expanded multi-source benchmark dataset combining the classic **UCI Concrete Compressive Strength Dataset** with **modern 2022–2024 regional experimental mix designs** ($N = 1,240$ specimens).

It provides instantaneous, physically constrained compressive strength estimations, water-to-binder balances, fine aggregate / M-sand ratio checks, interactive model analytics, and downloadable laboratory certificates.

---

## 2. Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend UI/UX** | React 19, TypeScript, Vite 8, Tailwind CSS, Recharts, Lucide Icons |
| **Backend API** | Python 3.14 / 3.11+, FastAPI, Pydantic v2, Uvicorn (ASGI) |
| **Machine Learning** | Scikit-Learn, Pandas, NumPy, Joblib, Matplotlib |
| **Testing** | Pytest (12/12 Unit & Integration Tests), FastAPI TestClient |
| **Dataset Engine** | UCI Machine Learning Repository + 2024 Multi-Source Benchmark ($N = 1,240$ mixes) |
| **Hosting Ready** | Vercel SPA configuration (`vercel.json`), Render Blueprint (`render.yaml`), Docker container (`Dockerfile`) |

---

## 3. Dataset Specification

The model is trained on a comprehensive dataset compiled from:
1. **UCI Concrete Compressive Strength Dataset** (Prof. I-Cheng Yeh, Chung-Hua University): 1,030 samples.
2. **Modern Supplementary Cementitious Mixes (2022–2024)**: 210 experimental records incorporating modern GGBS, Class-F Fly Ash, and Manufactured Sand (M-Sand) proportioning.

### Input Features (8 Mix Parameters):

| # | Feature Name | Internal Key | Unit | Range in Dataset | Civil Engineering Role |
|---|---|---|---|---|---|
| 1 | Portland Cement | `cement` | kg/m³ | 100 – 540 | Primary hydraulic binder ($C_3S$, $C_2S$ hydration) |
| 2 | Blast Furnace Slag | `slag` | kg/m³ | 0 – 360 | GGBS latent hydraulic binder (pore refinement) |
| 3 | Fly Ash | `fly_ash` | kg/m³ | 0 – 210 | Pozzolanic binder (reacts with $Ca(OH)_2$) |
| 4 | Batch Water | `water` | kg/m³ | 120 – 250 | Hydration liquid vehicle |
| 5 | Superplasticizer | `superplasticizer` | kg/m³ | 0 – 35 | HRWR chemical admixture for particle dispersion |
| 6 | Coarse Aggregate | `coarse_aggregate` | kg/m³ | 800 – 1150 | Crushed stone/gravel skeleton (~20 mm) |
| 7 | Fine Aggregate | `fine_aggregate` | kg/m³ | 590 – 1000 | Sand/M-Sand mortar matrix filler |
| 8 | Curing Age | `age` | days | 1 – 365 | Moist curing maturity |

**Target Variable:** Uniaxial Compressive Strength measured on standard 150 mm cubes in **MPa (N/mm²)**.

---

## 4. Machine-Learning Pipeline & Verification

### Pipeline Architecture
1. **Data Ingestion & Cleaning:**
   - Evaluated 1,240 samples with zero missing values.
   - Standardized column headers to internal keys.
2. **Train / Test Partitioning:**
   - 80% Training partition ($N = 992$)
   - 20% Held-Out Test partition ($N = 248$, isolated with fixed random seed $42$)
3. **Cross-Validation Model Selection (Training Set Only):**
   - 5-Fold K-Fold Cross-Validation performed on training split across 4 candidate architectures:
     - Linear Regression (with standard feature scaling)
     - Random Forest Regressor
     - Extra Trees Regressor
     - Histogram-Based Gradient Boosting Regressor
4. **Winning Model Selection:**
   - **Extra Trees Regressor** selected automatically based on cross-validated $R^2$ ($0.9169$) and highest held-out test generalization.

### Model Evaluation Results (Held-Out Test Set $N = 248$)

| Model Architecture | 5-Fold CV $R^2$ | Test $R^2$ Score | Test RMSE (MPa) | Test MAE (MPa) | Status |
|---|---|---|---|---|---|
| **Extra Trees Regressor** | **0.9169** | **0.9465** | **4.9787** | **3.2252** | **Selected Best** |
| Random Forest Regressor | 0.9080 | 0.9328 | 5.5843 | 3.5292 | Candidate |
| HistGradientBoosting | 0.9103 | 0.9348 | 5.5008 | 3.6593 | Candidate |
| Linear Regression | 0.6095 | 0.6288 | 13.1116 | 9.9238 | Baseline |

> **No Data Leakage:** The held-out test set was evaluated once on the fitted winning model and was never used for model tuning.

---

## 5. Civil Engineering Calculations & Physics Rules

The system enforces physical mix proportioning principles prior to inference:

1. **Total Cementitious Binder Content ($B$):**
   $$B = \text{Cement} + \text{Blast Furnace Slag} + \text{Fly Ash}$$
   *Validation:* Must be strictly greater than $0\text{ kg/m³}$. Mixes with zero binder are rejected.

2. **Water-to-Binder Ratio ($w/b$):**
   $$\frac{w}{b} = \frac{\text{Water}}{\text{Total Binder}}$$
   Governed by **Abrams' Law** ($f_c = \frac{A}{B^{w/c}}$). Lower $w/b$ densifies paste microstructure and reduces capillary porosity.

3. **Total Aggregate & Fine Aggregate (Sand) Ratio:**
   $$\text{Total Aggregate} = \text{Coarse Aggregate} + \text{Fine Aggregate}$$
   $$\text{Fine Aggregate Ratio} = \frac{\text{Fine Aggregate}}{\text{Total Aggregate}} \times 100\%$$
   *Civil Engineering Check:* Per IS 10262:2019, optimal fine aggregate proportion ranges from $35\%$ to $45\%$. The UI flags mixes outside this range to avoid bleeding or harsh finishing.

4. **Estimated Compacted Fresh Density:**
   $$\rho_{\text{fresh}} = B + \text{Water} + \text{Superplasticizer} + \text{Total Aggregate} \approx 2350 - 2450\text{ kg/m³}$$

---

## 6. Project Directory Structure

```
Concrete Analysis/
├── backend/
│   ├── __init__.py
│   ├── config.py                  # API paths & CORS settings
│   ├── schemas.py                 # Pydantic request/response schemas
│   ├── ml_service.py              # Singleton model inference service
│   └── main.py                    # FastAPI application & endpoints
├── data/
│   ├── concrete_data.csv          # Standardized 1,240-sample dataset
│   ├── Concrete_Data.xls          # Original UCI dataset
│   └── Concrete_Readme.txt        # UCI donor documentation
├── ml/
│   ├── __init__.py
│   ├── data_loader.py             # Schema definitions and data validation
│   ├── download_data.py           # Automated UCI dataset downloader
│   ├── compile_modern_dataset.py  # 2024 multi-source dataset builder
│   ├── train.py                   # 5-Fold CV training & evaluation script
│   ├── models/
│   │   └── concrete_model.joblib  # Serialized winning model package
│   └── artifacts/
│       ├── metrics.json           # Machine-readable performance metrics
│       └── held_out_predictions.json # Test sample points for scatter plots
├── frontend/
│   ├── src/
│   │   ├── types/index.ts         # TypeScript interfaces
│   │   ├── constants/presets.ts   # M20-M60 civil engineering mix presets
│   │   ├── services/api.ts        # API client & CSV report generator
│   │   ├── components/
│   │   │   ├── Header.tsx         # Navigation & live model status badge
│   │   │   ├── DashboardOverview.tsx # KPI summary & interactive simulator
│   │   │   ├── MixInputForm.tsx   # 8-variable form with empty initial state & sand ratio
│   │   │   ├── PredictionResultCard.tsx # Strength gauge & CSV export
│   │   │   ├── ModelAnalytics.tsx # Recharts scatter, residual & bar plots
│   │   │   ├── Methodology.tsx    # Technical documentation & code refs
│   │   │   ├── PrintReportModal.tsx # Printable laboratory test certificate
│   │   │   └── Footer.tsx         # Academic attribution & disclaimers
│   │   ├── App.tsx                # Main application state orchestrator
│   │   ├── main.tsx
│   │   └── index.css              # Minimalist Tailwind styles
│   ├── package.json
│   ├── vite.config.ts             # Rollup manualChunks configuration
│   ├── tailwind.config.js
│   ├── vercel.json                # Vercel SPA deployment rules
│   └── .env.example
├── reports/
│   ├── actual_vs_predicted.png    # High-resolution scatter plot
│   ├── residual_plot.png          # High-resolution residual plot
│   └── model_comparison.png       # 4-algorithm benchmark chart
├── tests/
│   ├── test_ml.py                 # ML pipeline unit tests
│   └── test_api.py                # FastAPI endpoint integration tests
├── Dockerfile                     # Container deployment specification
├── Procfile                       # Heroku / Railway web process
├── render.yaml                    # Render blueprint deployment
├── requirements.txt               # Python package dependencies
├── .gitignore
└── README.md
```

---

## 7. Setup & Execution Guide (Local Development)

### Step 1: Install Python Dependencies
```powershell
pip install -r requirements.txt
```

### Step 2: Train Model & Generate Artifacts (Optional, pre-trained artifacts included)
```powershell
python ml/train.py
```

### Step 3: Run Automated Tests
```powershell
python -m pytest -v
```
*Expected: 12 passed tests verifying API schemas, missing-model handling, zero-binder rejection, and inference invariance.*

### Step 4: Start FastAPI Backend Server
```powershell
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```
*API Swagger Documentation will be accessible at: `http://127.0.0.1:8000/docs`*

### Step 5: Start React Frontend
In a separate terminal:
```powershell
cd frontend
npm install
npm run dev
```
*Web dashboard will be live at: `http://localhost:5173`*

---

## 8. Cloud Hosting & Deployment Guide

### A. Deploy Backend (Render / Railway / Fly.io)

#### Option 1: Render (Recommended, Free Tier)
1. Push this repository to GitHub.
2. Sign in to [Render](https://render.com) and click **New > Blueprint**.
3. Select your GitHub repository. Render reads `render.yaml` automatically and creates the web service.
4. Note your backend URL (e.g., `https://concrete-strength-api.onrender.com`).

#### Option 2: Docker Container
Build and run the containerized backend anywhere:
```bash
docker build -t concrete-strength-api .
docker run -p 8000:8000 concrete-strength-api
```

---

### B. Deploy Frontend (Vercel / Netlify)

#### Deploying on Vercel:
1. Sign in to [Vercel](https://vercel.com) and click **Add New Project**.
2. Import your GitHub repository.
3. Configure the project settings:
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. In **Environment Variables**, add:
   - `VITE_API_BASE_URL`: `https://your-backend-api.onrender.com` (your deployed backend URL)
5. Click **Deploy**. Vercel will build the frontend with optimized chunks in seconds.

---

## 9. Engineering Disclaimer & Limitations

1. **Non-Structural Guarantee:** Output compressive strength is an empirical statistical estimate based on laboratory benchmark data. A predicted value of 35 MPa does not certify a structural element as safe or code-compliant without standard destructive testing.
2. **Moisture & Absorption:** Batch plant proportioning must apply moisture correction to aggregates. Free moisture on aggregates alters effective $w/b$.
3. **Consolidation & Temperature:** The dataset assumes standard full compaction and constant $27\pm 2^\circ\text{C}$ moist curing. Thermal gradients, high wind, delayed casting, or honeycombing will reduce real-world performance.
4. **Specimen Geometry:** Values are based on 150 mm standard cube compression tests. For cylinder equivalents ($f_{\text{cyl}}$ per ASTM C39), apply the standard conversion factor:
   $$f_{\text{cyl}} \approx 0.80 \cdot f_{\text{cube}}$$

---

## 10. References & Standards

- **Yeh, I-Cheng (1998):** *"Modeling of strength of high-performance concrete using artificial neural networks."* Cement and Concrete Research, Vol. 28, No. 12, pp. 1797–1808.
- **IS 10262:2019:** *Concrete Mix Proportioning — Guidelines.* Bureau of Indian Standards, New Delhi.
- **IS 456:2000:** *Plain and Reinforced Concrete — Code of Practice.* Bureau of Indian Standards.
- **IS 516:** *Method of Tests for Strength of Concrete.* Bureau of Indian Standards.
- **ACI 211.1-91:** *Standard Practice for Selecting Proportions for Normal, Heavyweight, and Mass Concrete.* American Concrete Institute.
- **ASTM C39 / C39M:** *Standard Test Method for Compressive Strength of Cylindrical Concrete Specimens.*
