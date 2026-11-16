from pathlib import Path
import joblib
import numpy as np

MODEL_PATH = Path("models/solar_energy_model.pkl")

class SolarPredictionModel:
    def __init__(self):
        self.model = None
        if MODEL_PATH.exists():
            self.model = joblib.load(MODEL_PATH)

    def reload(self):
        if not MODEL_PATH.exists():
            self.model = None
            return False
        self.model = joblib.load(MODEL_PATH)
        return True

    def predict(self, features):
        if self.model is None:
            raise FileNotFoundError(
                "Solar energy prediction model has not been trained yet."
            )
        values = np.array([features], dtype=float)
        prediction = self.model.predict(values)
        return float(prediction[0])

solar_model = SolarPredictionModel()
