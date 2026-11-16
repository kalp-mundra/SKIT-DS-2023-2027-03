
from pathlib import Path

import numpy as np
import pandas as pd


# Project root directory
PROJECT_ROOT = Path(__file__).resolve().parent.parent

# Raw dataset location
DATASET_PATH = PROJECT_ROOT / "data" / "raw" / "Renewable.csv"

# Features used by the prediction model
FEATURE_COLUMNS = [
    "GHI",
    "temp",
    "humidity",
    "wind_speed",
]

# Target column
TARGET_COLUMN = "Energy delta[Wh]"


def load_dataset(data_path=DATASET_PATH):
    """Load and validate the raw solar energy dataset."""

    data_path = Path(data_path)

    if not data_path.exists():
        raise FileNotFoundError(f"Dataset not found: {data_path}")

    df = pd.read_csv(data_path)

    required_columns = (
        ["Time"] + FEATURE_COLUMNS + [TARGET_COLUMN]
    )

    missing_columns = [
        column for column in required_columns
        if column not in df.columns
    ]

    if missing_columns:
        raise ValueError(
            f"Missing required columns: {missing_columns}"
        )

    return df


def preprocess_data(df):
    """Clean data and prepare chronological ML features."""

    df = df.copy()

    # Convert timestamp
    df["Time"] = pd.to_datetime(
        df["Time"], errors="coerce"
    )

    # Convert required numeric columns
    numeric_columns = FEATURE_COLUMNS + [TARGET_COLUMN]

    for column in numeric_columns:
        df[column] = pd.to_numeric(
            df[column], errors="coerce"
        )

    # Remove invalid and infinite values
    df = df.replace([np.inf, -np.inf], np.nan)

    # Remove rows with invalid required values
    df = df.dropna(
        subset=["Time"] + numeric_columns
    )

    # Validate physical values
    df = df[
        (df["GHI"] >= 0)
        & (df["humidity"].between(0, 100))
        & (df["wind_speed"] >= 0)
        & (df[TARGET_COLUMN] >= 0)
    ]

    # Remove duplicate timestamps
    df = df.drop_duplicates(
        subset=["Time"], keep="first"
    )

    # Sort chronologically
    df = df.sort_values("Time").reset_index(drop=True)

    # Separate features and target
    X = df[FEATURE_COLUMNS]
    y = df[TARGET_COLUMN]

    return df, X, y


def split_data(X, y, test_size=0.20):
    """Split data chronologically without shuffling."""

    if not 0 < test_size < 1:
        raise ValueError("test_size must be between 0 and 1")

    split_index = int(len(X) * (1 - test_size))

    X_train = X.iloc[:split_index]
    X_test = X.iloc[split_index:]

    y_train = y.iloc[:split_index]
    y_test = y.iloc[split_index:]

    return X_train, X_test, y_train, y_test
