from datetime import datetime
from sqlalchemy import Column, DateTime, Float, Integer, String
from app.database import Base

class SolarRecord(Base):
    __tablename__ = "solar_records"

    id = Column(Integer, primary_key=True, index=True)
    panel_id = Column(String(100), nullable=False, default="panel-1", index=True)
    recorded_at = Column(DateTime, nullable=False, default=datetime.utcnow, index=True)
    irradiance = Column(Float, nullable=False)
    temperature = Column(Float, nullable=False)
    humidity = Column(Float, nullable=False)
    wind_speed = Column(Float, nullable=False)
    actual_energy_output = Column(Float, nullable=True)
    predicted_energy_output = Column(Float, nullable=True)
    record_type = Column(String(30), nullable=False, default="measurement")
