"""
Main entry point for Hugging Face Spaces (Gradio SDK - 100% Free Tier).
Mounts the FastAPI prediction backend so both the interactive Gradio UI
and the REST API endpoints (/api/v1/predict, /health, /api/v1/metrics)
are served on the same port without needing Docker or a credit card.
"""

import os
import sys

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

import gradio as gr
from backend.main import app as fastapi_app
from backend.ml_service import ml_service
from backend.schemas import ConcreteMixInput


def predict_strength(cement, slag, fly_ash, water, superplasticizer, coarse_agg, fine_agg, age):
    try:
        mix = ConcreteMixInput(
            cement=float(cement),
            slag=float(slag),
            fly_ash=float(fly_ash),
            water=float(water),
            superplasticizer=float(superplasticizer),
            coarse_aggregate=float(coarse_agg),
            fine_aggregate=float(fine_agg),
            age=float(age)
        )
        res = ml_service.predict(mix)
        calc = res["calculated_properties"]
        return (
            f"{res['predicted_strength_mpa']} MPa",
            f"w/b ratio: {calc['water_to_binder_ratio']:.3f} | Total Binder: {calc['total_binder_kg_m3']} kg/m³ | Sand Ratio: {calc['fine_to_total_aggregate_ratio']*100:.1f}%",
            f"Model: {res['model_name']} (v{res['model_version']})"
        )
    except Exception as e:
        return f"Error: {str(e)}", "", ""


with gr.Blocks(title="Concrete Strength Predictor") as demo:
    gr.Markdown("# 🏗️ Concrete Compressive Strength Predictor (ConcreteIQ)")
    gr.Markdown(
        "B.Tech Civil Engineering Machine Learning Engine. "
        "The underlying FastAPI REST server is live and accepting requests at `/api/v1/predict` and `/health`."
    )
    with gr.Row():
        with gr.Column():
            c = gr.Number(label="Cement (kg/m³)", value=380.0)
            s = gr.Number(label="Blast Furnace Slag (kg/m³)", value=100.0)
            fa = gr.Number(label="Fly Ash (kg/m³)", value=0.0)
            w = gr.Number(label="Water (kg/m³)", value=165.0)
        with gr.Column():
            sp = gr.Number(label="Superplasticizer (kg/m³)", value=6.0)
            ca = gr.Number(label="Coarse Aggregate (kg/m³)", value=1000.0)
            f_agg = gr.Number(label="Fine Aggregate (kg/m³)", value=750.0)
            age = gr.Number(label="Curing Age (days)", value=28.0)
    btn = gr.Button("Calculate Compressive Strength (MPa)", variant="primary")
    out_strength = gr.Textbox(label="Predicted Compressive Strength")
    out_props = gr.Textbox(label="Mix Ratios & Binder Balance")
    out_model = gr.Textbox(label="Model Engine")
    btn.click(predict_strength, inputs=[c, s, fa, w, sp, ca, f_agg, age], outputs=[out_strength, out_props, out_model])

# Mount Gradio onto the existing FastAPI application
app = gr.mount_gradio_app(fastapi_app, demo, path="/")

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 7860))
    uvicorn.run(app, host="0.0.0.0", port=port)
