from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_PATH = BASE_DIR / "models" / "solar_energy_model.pkl"
DATABASE_URL = "sqlite:///./heliq.db"
