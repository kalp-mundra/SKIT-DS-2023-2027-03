from fastapi import FastAPI, HTTPException

from app.schemas import (
    SolarPredictionRequest,
    SolarPredictionResponse,
    MonitoringResponse,
)
from app.model_service import solar_model
from app.monitoring import get_system_status

app = FastAPI(
    title="Heliq Solar Energy Prediction API",
    description=(
        "AI-based solar panel energy output prediction "
        "and monitoring backend."
    ),
    version="1.0.0",
)

@app.get("/")
def root():
    return {
        "project": "Heliq",
        "description": "AI-Based Solar Panel Energy Output Prediction System",
        "status": "running",
    }

@app.get("/health", response_model=MonitoringResponse)
def health_check():
    return get_system_status()

@app.post("/predict", response_model=SolarPredictionResponse)
def predict_energy(request: SolarPredictionRequest):
    try:
        features = [
            request.irradiance,
            request.temperature,
            request.humidity,
            request.wind_speed,
        ]

        prediction = solar_model.predict(features)

        return {
            "predicted_energy_output": round(prediction, 4),
            "unit": "kWh",
            "status": "prediction successful",
        }

    except FileNotFoundError as error:
        raise HTTPException(status_code=503, detail=str(error))

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed: {error}",
        )

@app.get("/monitor")
def monitor():
    status = get_system_status()
    return {
        "system": status,
        "message": "Solar energy prediction service is being monitored.",
    }
