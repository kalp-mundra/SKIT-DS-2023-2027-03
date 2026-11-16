
from pathlib import Path

import joblib
import numpy as np
import pandas as pd


PROJECT_ROOT = Path(__file__).resolve().parent.parent
MODEL_PATH = PROJECT_ROOT / "models" / "solar_energy_model.pkl"


class SolarPredictionModel:

    def __init__(self):
        self.model = None
        self.features = []
        self.target_unit = None
        self.reload()

    def reload(self):
        """Load trained model and its metadata."""

        if not MODEL_PATH.exists():
            self.model = None
            self.features = []
            self.target_unit = None
            return False

        artifact = joblib.load(MODEL_PATH)

        if not isinstance(artifact, dict):
            raise ValueError("Invalid model artifact format.")

        required_keys = ["model", "features", "target_unit"]

        if not all(key in artifact for key in required_keys):
            raise ValueError("Model artifact is missing required metadata.")

        self.model = artifact["model"]
        self.features = artifact["features"]
        self.target_unit = artifact["target_unit"]

        return True

    def predict(self, features):
        """Predict solar energy output in the artifact's target unit."""

        if self.model is None:
            raise FileNotFoundError(
                "Solar energy prediction model has not been trained yet."
            )

        if len(features) != len(self.features):
            raise ValueError(
                f"Expected {len(self.features)} features, "
                f"received {len(features)}."
            )

        values = np.asarray(features, dtype=float)

        if not np.isfinite(values).all():
            raise ValueError("Input features must be finite numbers.")

        input_data = pd.DataFrame(
            [values],
            columns=self.features,
        )

        prediction = self.model.predict(input_data)

        return float(prediction[0])


solar_model = SolarPredictionModel()
