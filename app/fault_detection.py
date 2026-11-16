
from pathlib import Path

import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import IsolationForest

from app.preprocessing import load_dataset


PROJECT_ROOT = Path(__file__).resolve().parent.parent
FAULT_MODEL_PATH = PROJECT_ROOT / "models" / "fault_detection_model.pkl"

FAULT_FEATURES = [
    "GHI",
    "temp",
    "humidity",
    "wind_speed",
    "Energy delta[Wh]",
]


class SolarFaultDetector:
    def __init__(self):
        self.model = None
        self.train()

    def train(self):
        """Train Isolation Forest using historical daylight observations."""

        df = load_dataset()

        df["isSun"] = pd.to_numeric(df["isSun"], errors="coerce")

        daylight_data = df[df["isSun"] == 1].copy()

        daylight_data = daylight_data.dropna(
            subset=FAULT_FEATURES
        )

        X = daylight_data[FAULT_FEATURES]

        self.model = IsolationForest(
            n_estimators=200,
            contamination=0.03,
            random_state=42,
            n_jobs=-1,
        )

        self.model.fit(X)

        FAULT_MODEL_PATH.parent.mkdir(
            parents=True,
            exist_ok=True,
        )

        joblib.dump(self.model, FAULT_MODEL_PATH)

        return len(X)


    def detect(self, df):
        """Detect anomalies using Isolation Forest and sustained zero-output rules."""

        df = df.copy()

        df["Time"] = pd.to_datetime(
            df["Time"], errors="coerce"
        )

        numeric_columns = FAULT_FEATURES + ["isSun"]

        for column in numeric_columns:
            df[column] = pd.to_numeric(
                df[column], errors="coerce"
            )

        df = df.dropna(
            subset=["Time"] + numeric_columns
        )

        daylight_data = df[
            df["isSun"] == 1
        ].copy()

        if daylight_data.empty:
            return []

        daylight_data = daylight_data.sort_values(
            "Time"
        ).reset_index(drop=True)

        # -------------------------------------------------
        # 1. Rule-based detection: sustained zero output
        # -------------------------------------------------

        rule_data = daylight_data[
            daylight_data["GHI"] >= 100
        ].copy()

        rule_data["zero_output"] = (
            rule_data["Energy delta[Wh]"] == 0
        )

        # Start a new group when timestamps are not
        # consecutive 15-minute intervals or zero status changes.
        time_gap = (
            rule_data["Time"].diff()
            != pd.Timedelta(minutes=15)
        )

        status_change = (
            rule_data["zero_output"]
            != rule_data["zero_output"].shift()
        )

        rule_data["group"] = (
            time_gap | status_change
        ).cumsum()

        alerts = []

        zero_events = rule_data[
            rule_data["zero_output"]
        ].groupby("group")

        for _, event in zero_events:
            record_count = len(event)

            duration_minutes = (
                record_count - 1
            ) * 15

            # At least 60 minutes between first and last
            # observation, i.e. 5 consecutive 15-min records.
            if duration_minutes < 60:
                continue

            start_time = event["Time"].iloc[0]
            end_time = event["Time"].iloc[-1]

            alerts.append({
                "id": (
                    f"RULE-{start_time.strftime('%Y%m%d%H%M')}"
                ),
                "panelId": None,
                "title": "Sustained zero energy generation",
                "severity": "critical",
                "message": (
                    "Zero energy generation continued despite "
                    "sufficient solar irradiance. "
                    "Inspection is recommended."
                ),
                "time": start_time.isoformat(),
                "end_time": end_time.isoformat(),
                "duration_minutes": duration_minutes,
                "records": record_count,
                "resolved": False,
                "detection_type": "rule_based",
            })


        # -------------------------------------------------
        # 2. Isolation Forest: unusual generation patterns
        # -------------------------------------------------

        predictions = self.model.predict(
            daylight_data[FAULT_FEATURES]
        )

        scores = self.model.decision_function(
            daylight_data[FAULT_FEATURES]
        )

        # Collect timestamps already covered by critical events.
        critical_intervals = [
            (
                pd.Timestamp(alert["time"]),
                pd.Timestamp(alert["end_time"]),
            )
            for alert in alerts
            if alert["detection_type"] == "rule_based"
        ]

        for index, (_, row) in enumerate(
            daylight_data.iterrows()
        ):
            if predictions[index] != -1:
                continue

            # Avoid duplicate warnings for observations
            # already covered by critical rule-based events.
            covered_by_critical = any(
                start <= row["Time"] <= end
                for start, end in critical_intervals
            )

            if covered_by_critical:
                continue

            alerts.append({
                "id": (
                    f"ANM-{row['Time'].strftime('%Y%m%d%H%M')}"
                ),
                "panelId": None,
                "title": "Unusual generation pattern",
                "severity": "warning",
                "message": (
                    "The observed weather and energy pattern "
                    "differs from normal historical behavior."
                ),
                "time": row["Time"].isoformat(),
                "resolved": False,
                "energy_wh": round(
                    float(row["Energy delta[Wh]"]), 2
                ),
                "irradiance": round(
                    float(row["GHI"]), 2
                ),
                "anomaly_score": round(
                    float(scores[index]), 4
                ),
                "detection_type": "isolation_forest",
            })


        return sorted(
            alerts,
            key=lambda alert: alert["time"],
            reverse=True,
        )



solar_fault_detector = SolarFaultDetector()
