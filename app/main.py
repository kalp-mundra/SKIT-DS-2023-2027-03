from fastapi import FastAPI, HTTPException

from app.schemas import (
    SolarPredictionRequest,
    SolarPredictionResponse,
    MonitoringResponse,
)
from app.model_service import solar_model
from app.monitoring import get_system_status
from app.preprocessing import load_dataset
import pandas as pd
from datetime import timedelta

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

        prediction_wh = solar_model.predict(features)

        prediction_kwh = prediction_wh / 1000

        return {
            "predicted_energy_output": round(prediction_kwh, 4),
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


@app.get("/dashboard/summary")
def dashboard_summary():
    try:
        df = load_dataset()

        # Convert timestamps
        df["Time"] = pd.to_datetime(df["Time"])

        # Get latest available date
        latest_date = df["Time"].max().date()

        # Filter records for latest date
        daily_data = df[
            df["Time"].dt.date == latest_date
        ]

        return {
            "date": str(latest_date),
            "total_energy_kwh": round(
                daily_data["Energy delta[Wh]"].sum() / 1000, 3
            ),
            "average_irradiance": round(
                daily_data["GHI"].mean(), 2
            ),
            "average_temperature": round(
                daily_data["temp"].mean(), 2
            ),
            "average_humidity": round(
                daily_data["humidity"].mean(), 2
            ),
            "average_wind_speed": round(
                daily_data["wind_speed"].mean(), 2
            ),
            "total_observations": len(daily_data),
            "data_type": "historical"
        }

    except FileNotFoundError as error:
        raise HTTPException(status_code=503, detail=str(error))

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Dashboard summary failed: {error}"
        )


@app.get("/dashboard/generation")
def dashboard_generation(days: int = 30):
    try:
        if days < 1 or days > 365:
            raise HTTPException(
                status_code=400,
                detail="Days must be between 1 and 365."
            )

        df = load_dataset()

        df["Time"] = pd.to_datetime(df["Time"])

        # Find latest available date in dataset
        latest_date = df["Time"].max().normalize()

        # Calculate date range
        start_date = latest_date - timedelta(days=days - 1)

        # Filter records
        filtered_df = df[
            (df["Time"] >= start_date)
            & (df["Time"] < latest_date + timedelta(days=1))
        ].copy()

        # Aggregate daily energy generation
        daily_data = (
            filtered_df
            .groupby(filtered_df["Time"].dt.date)["Energy delta[Wh]"]
            .sum()
            .reset_index()
        )

        # Format response
        generation = [
            {
                "date": str(row["Time"]),
                "energy_kwh": round(
                    row["Energy delta[Wh]"] / 1000, 3
                )
            }
            for _, row in daily_data.iterrows()
        ]

        return {
            "period_days": days,
            "start_date": str(start_date.date()),
            "end_date": str(latest_date.date()),
            "unit": "kWh",
            "data_type": "historical",
            "total_records": len(generation),
            "generation": generation
        }

    except HTTPException:
        raise

    except FileNotFoundError as error:
        raise HTTPException(status_code=503, detail=str(error))

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Generation data fetch failed: {error}"
        )