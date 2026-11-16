from contextlib import asynccontextmanager
from datetime import datetime
from typing import Optional

from fastapi import Depends, FastAPI, HTTPException, Query
from sqlalchemy import desc, func
from sqlalchemy.orm import Session

from app.database import Base, engine, get_db
from app.db_models import SolarRecord
from app.schemas import (
    MonitoringResponse, SolarMeasurementCreate, SolarPredictionRequest,
    SolarPredictionResponse, SolarRecordResponse
)
from app.model_service import solar_model
from app.monitoring import get_system_status

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Creates the SQLite tables on first startup.
    Base.metadata.create_all(bind=engine)
    yield

app = FastAPI(
    title="Heliq Solar Energy API",
    description="Solar energy-output prediction, data storage and monitoring.",
    version="2.0.0",
    lifespan=lifespan,
)

@app.get("/")
def root():
    return {
        "project": "Heliq",
        "message": "Solar energy output prediction backend is running.",
        "docs": "/docs",
        "fault_detection": "planned future phase",
    }

@app.get("/health", response_model=MonitoringResponse)
def health_check(db: Session = Depends(get_db)):
    return get_system_status(db)

@app.get("/monitor")
def monitor(db: Session = Depends(get_db)):
    status = get_system_status(db)
    total_records = db.query(func.count(SolarRecord.id)).scalar() or 0
    return {"system": status, "stored_records": total_records}

@app.post("/readings", response_model=SolarRecordResponse, status_code=201)
def create_reading(payload: SolarMeasurementCreate, db: Session = Depends(get_db)):
    record = SolarRecord(
        panel_id=payload.panel_id,
        recorded_at=payload.recorded_at or datetime.utcnow(),
        irradiance=payload.irradiance,
        temperature=payload.temperature,
        humidity=payload.humidity,
        wind_speed=payload.wind_speed,
        actual_energy_output=payload.actual_energy_output,
        record_type="measurement",
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return record

@app.get("/readings", response_model=list[SolarRecordResponse])
def list_readings(
    panel_id: Optional[str] = None,
    limit: int = Query(default=100, ge=1, le=1000),
    db: Session = Depends(get_db),
):
    query = db.query(SolarRecord)
    if panel_id:
        query = query.filter(SolarRecord.panel_id == panel_id)
    return query.order_by(desc(SolarRecord.recorded_at)).limit(limit).all()

@app.get("/readings/latest", response_model=Optional[SolarRecordResponse])
def latest_reading(panel_id: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(SolarRecord)
    if panel_id:
        query = query.filter(SolarRecord.panel_id == panel_id)
    return query.order_by(desc(SolarRecord.recorded_at)).first()

@app.post("/predict", response_model=SolarPredictionResponse)
def predict_energy(payload: SolarPredictionRequest, db: Session = Depends(get_db)):
    feature_values = {
        "irradiance": payload.irradiance,
        "temperature": payload.temperature,
        "humidity": payload.humidity,
        "wind_speed": payload.wind_speed,
    }
    try:
        prediction = solar_model.predict(feature_values)
    except FileNotFoundError as exc:
        raise HTTPException(status_code=503, detail=str(exc))
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc))
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {exc}")

    record = SolarRecord(
        panel_id=payload.panel_id,
        recorded_at=datetime.utcnow(),
        irradiance=payload.irradiance,
        temperature=payload.temperature,
        humidity=payload.humidity,
        wind_speed=payload.wind_speed,
        predicted_energy_output=prediction,
        record_type="prediction",
    )
    db.add(record)
    db.commit()
    db.refresh(record)

    return {
        "record_id": record.id,
        "predicted_energy_output": round(prediction, 4),
        "unit": "same unit as the training target",
        "status": "prediction successful",
    }

@app.post("/model/reload")
def reload_model():
    # Call after replacing the model file; protect this endpoint before public deployment.
    loaded = solar_model.load()
    if not loaded:
        raise HTTPException(status_code=404, detail="Model file not found.")
    return {"message": "Model loaded successfully", "features": solar_model.feature_names}
