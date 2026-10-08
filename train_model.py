import argparse
from pathlib import Path

import joblib
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import train_test_split


def train_model(data_path, features, target, model_path):
    data_path = Path(data_path)
    model_path = Path(model_path)

    if not data_path.exists():
        raise FileNotFoundError(f"Dataset not found: {data_path}")

    df = pd.read_csv(data_path)

    missing = [c for c in features + [target] if c not in df.columns]
    if missing:
        raise ValueError(
            "The following required columns are missing from the dataset: "
            + ", ".join(missing)
        )

    df = df[features + [target]].dropna()

    if len(df) < 10:
        raise ValueError("Not enough valid rows to train the model.")

    X = df[features]
    y = df[target]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42
    )

    model = RandomForestRegressor(
        n_estimators=200,
        random_state=42,
        n_jobs=-1,
    )

    model.fit(X_train, y_train)

    predictions = model.predict(X_test)

    mae = mean_absolute_error(y_test, predictions)
    rmse = mean_squared_error(y_test, predictions) ** 0.5
    r2 = r2_score(y_test, predictions)

    model_path.parent.mkdir(parents=True, exist_ok=True)

    # Save both model and feature order to avoid accidental API mismatch.
    artifact = {
        "model": model,
        "features": features,
        "target": target,
    }
    joblib.dump(artifact, model_path)

    print("\nModel Evaluation")
    print("----------------")
    print(f"MAE  : {mae:.4f}")
    print(f"RMSE : {rmse:.4f}")
    print(f"R2   : {r2:.4f}")
    print(f"\nModel saved to: {model_path}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Train Heliq solar energy prediction model."
    )
    parser.add_argument(
        "--data",
        default="../data/processed/cleaned_solar_data.csv",
    )
    parser.add_argument(
        "--features",
        nargs="+",
        required=True,
        help="Exact feature column names in the dataset.",
    )
    parser.add_argument(
        "--target",
        required=True,
        help="Exact target column name.",
    )
    parser.add_argument(
        "--model",
        default="models/solar_energy_model.pkl",
    )

    args = parser.parse_args()

    train_model(
        args.data,
        args.features,
        args.target,
        args.model,
    )
