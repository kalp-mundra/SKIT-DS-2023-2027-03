
import argparse
from pathlib import Path

import joblib
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

from app.preprocessing import (
    FEATURE_COLUMNS,
    TARGET_COLUMN,
    load_dataset,
    preprocess_data,
    split_data,
)


PROJECT_ROOT = Path(__file__).resolve().parent

DEFAULT_DATA_PATH = PROJECT_ROOT / "data" / "raw" / "Renewable.csv"
DEFAULT_MODEL_PATH = PROJECT_ROOT / "models" / "solar_energy_model.pkl"


def train_model(data_path, model_path, test_size=0.20, n_estimators=200):

    # Load and preprocess dataset
    df = load_dataset(data_path)
    clean_df, X, y = preprocess_data(df)

    if len(clean_df) < 10:
        raise ValueError("Not enough valid records for training.")

    # Chronological train-test split
    X_train, X_test, y_train, y_test = split_data(
        X, y, test_size
    )

    if len(X_train) == 0 or len(X_test) == 0:
        raise ValueError("Training or testing dataset is empty.")

    # Initialize Random Forest
    model = RandomForestRegressor(
        n_estimators=n_estimators,
        random_state=42,
        n_jobs=-1,
    )

    # Train model
    print("\nTraining Random Forest model...")
    model.fit(X_train, y_train)

    # Generate predictions
    predictions = model.predict(X_test)

    # Evaluate model
    mae = mean_absolute_error(y_test, predictions)
    rmse = mean_squared_error(y_test, predictions) ** 0.5
    r2 = r2_score(y_test, predictions)

    # Create model directory
    model_path = Path(model_path)
    model_path.parent.mkdir(parents=True, exist_ok=True)

    # Save model and metadata
    artifact = {
        "model": model,
        "features": FEATURE_COLUMNS,
        "target": TARGET_COLUMN,
        "target_unit": "Wh",
        "metrics": {
            "mae": float(mae),
            "rmse": float(rmse),
            "r2": float(r2),
        },
        "train_period": {
            "start": str(clean_df.iloc[0]["Time"]),
            "end": str(clean_df.iloc[len(X_train) - 1]["Time"]),
        },
        "test_period": {
            "start": str(clean_df.iloc[len(X_train)]["Time"]),
            "end": str(clean_df.iloc[-1]["Time"]),
        },
    }

    joblib.dump(artifact, model_path)

    # Display evaluation results
    print("\nMODEL EVALUATION")
    print("-------------------------")
    print(f"Training records : {len(X_train)}")
    print(f"Testing records  : {len(X_test)}")
    print(f"MAE              : {mae:.4f} Wh")
    print(f"RMSE             : {rmse:.4f} Wh")
    print(f"R2 Score         : {r2:.4f}")

    print("\nFEATURE IMPORTANCE")
    print("-------------------------")

    for name, importance in sorted(
        zip(FEATURE_COLUMNS, model.feature_importances_),
        key=lambda item: item[1],
        reverse=True,
    ):
        print(f"{name}: {importance:.4f}")

    print(f"\nModel saved to: {model_path}")

    return artifact


if __name__ == "__main__":

    parser = argparse.ArgumentParser(
        description="Train Heliq solar energy prediction model."
    )

    parser.add_argument(
        "--data",
        default=str(DEFAULT_DATA_PATH),
        help="Path to the raw solar dataset.",
    )

    parser.add_argument(
        "--model",
        default=str(DEFAULT_MODEL_PATH),
        help="Path to save the trained model.",
    )

    parser.add_argument(
        "--test-size",
        type=float,
        default=0.20,
        help="Fraction of data reserved for testing.",
    )

    parser.add_argument(
        "--n-estimators",
        type=int,
        default=200,
        help="Number of Random Forest trees.",
    )

    args = parser.parse_args()

    train_model(
        data_path=args.data,
        model_path=args.model,
        test_size=args.test_size,
        n_estimators=args.n_estimators,
    )
