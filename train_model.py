import argparse
from pathlib import Path

import joblib
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import train_test_split

def main():
    parser = argparse.ArgumentParser(description="Train Heliq solar energy regression model.")
    parser.add_argument("--data", default="../data/processed/cleaned_solar_data.csv")
    parser.add_argument("--features", nargs="+", required=True,
                        help="Feature columns; supported API inputs: irradiance temperature humidity wind_speed")
    parser.add_argument("--target", required=True, help="Energy-output target column")
    parser.add_argument("--model", default="models/solar_energy_model.pkl")
    args = parser.parse_args()

    unsupported = set(args.features) - {"irradiance", "temperature", "humidity", "wind_speed"}
    if unsupported:
        raise ValueError(
            "The current /predict API accepts only: irradiance temperature humidity wind_speed. "
            "Unsupported features: " + ", ".join(sorted(unsupported)) +
            ". Update SolarInput and /predict mapping before training with additional features."
        )

    df = pd.read_csv(args.data)
    required = args.features + [args.target]
    missing = [col for col in required if col not in df.columns]
    if missing:
        raise ValueError("Columns missing from dataset: " + ", ".join(missing))

    df = df[required].apply(pd.to_numeric, errors="coerce").dropna()
    if len(df) < 10:
        raise ValueError("At least 10 complete rows are required for training.")

    X, y = df[args.features], df[args.target]
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    model = RandomForestRegressor(n_estimators=200, random_state=42, n_jobs=-1)
    model.fit(X_train, y_train)
    predictions = model.predict(X_test)

    print(f"MAE : {mean_absolute_error(y_test, predictions):.4f}")
    print(f"RMSE: {mean_squared_error(y_test, predictions) ** 0.5:.4f}")
    print(f"R2  : {r2_score(y_test, predictions):.4f}")

    model_path = Path(args.model)
    model_path.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump({"model": model, "features": args.features, "target": args.target}, model_path)
    print(f"Saved model: {model_path.resolve()}")

if __name__ == "__main__":
    main()
