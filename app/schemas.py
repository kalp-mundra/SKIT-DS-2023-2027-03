from pydantic import BaseModel, Field

class SolarPredictionRequest(BaseModel):
    irradiance: float = Field(..., description="Solar irradiance")
    temperature: float = Field(..., description="Ambient temperature")
    humidity: float = Field(..., description="Relative humidity")
    wind_speed: float = Field(..., description="Wind speed")

class SolarPredictionResponse(BaseModel):
    predicted_energy_output: float
    unit: str
    status: str

class MonitoringResponse(BaseModel):
    service: str
    status: str
    model_available: bool
