from sqlalchemy import text
from app.config import MODEL_PATH

def get_system_status(db):
    model_available = MODEL_PATH.exists()
    database_connected = False
    try:
        db.execute(text("SELECT 1"))
        database_connected = True
    except Exception:
        database_connected = False

    return {
        "service": "Heliq Solar Energy Prediction API",
        "status": "operational" if database_connected else "degraded",
        "model_available": model_available,
        "database_connected": database_connected,
    }
