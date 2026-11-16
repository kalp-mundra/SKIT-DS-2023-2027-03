from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field

class SolarInput(BaseModel):
    panel_id: str = Field(default="panel-1", min_length=1, max_length=100)
    irradiance: float = Field(..., ge=0, description="Solar irradiance; use the same unit as training data")
    temperature: float
    humidity: float = Field(..., ge=0, le=100)
    wind_speed: float = Field(..., ge=0)

class SolarPredictionRequest(SolarInput):
    pass

class SolarPredictionResponse(BaseModel):
    record_id: int
    predicted_energy_output: float
    unit: str = "same unit as the training target"
    status: str = "prediction successful"

class SolarMeasurementCreate(SolarInput):
    actual_energy_output: Optional[float] = Field(default=None, ge=0)
    recorded_at: Optional[datetime] = None

class SolarRecordResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    panel_id: str
    recorded_at: datetime
    irradiance: float
    temperature: float
    humidity: float
    wind_speed: float
    actual_energy_output: Optional[float]
    predicted_energy_output: Optional[float]
    record_type: str

class MonitoringResponse(BaseModel):
    service: str
    status: str
    model_available: bool
    database_connected: bool
