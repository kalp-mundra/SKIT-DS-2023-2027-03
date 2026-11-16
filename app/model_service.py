import joblib
import pandas as pd
from app.config import MODEL_PATH

class SolarPredictionModel:
    def __init__(self):
        self.model = None
        self.feature_names = []
        self.load()

    def load(self):
        if not MODEL_PATH.exists():
            self.model = None
            self.feature_names = []
            return False

        artifact = joblib.load(MODEL_PATH)
        # Supports the artifact format produced by the updated training script.
        if isinstance(artifact, dict) and "model" in artifact:
            self.model = artifact["model"]
            self.feature_names = artifact["features"]
        else:
            # Backward compatibility with a plain sklearn model.
            self.model = artifact
            self.feature_names = getattr(artifact, "feature_names_in_", []).tolist()
        return True

    def predict(self, feature_values: dict):
        if self.model is None:
            raise FileNotFoundError("Model not found. Train it using train_model.py first.")

        if not self.feature_names:
            raise ValueError("Model feature names are missing. Retrain using the updated train_model.py.")

        missing = [name for name in self.feature_names if name not in feature_values]
        if missing:
            raise ValueError("API input is missing model features: " + ", ".join(missing))

        row = pd.DataFrame(
            [[feature_values[name] for name in self.feature_names]],
            columns=self.feature_names
        )
        return float(self.model.predict(row)[0])

solar_model = SolarPredictionModel()
