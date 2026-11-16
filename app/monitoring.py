from pathlib import Path

MODEL_PATH = Path("models/solar_energy_model.pkl")

def get_system_status():
    model_available = MODEL_PATH.exists()

    return {
        "service": "Heliq Solar Energy Prediction API",
        "status": "operational",
        "model_available": model_available
    }
