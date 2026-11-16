# Heliq Backend

This folder extends the original FastAPI backend with:
- SQLite database persistence using SQLAlchemy
- Solar measurement ingestion and retrieval APIs
- Prediction results stored in the database
- Model loading with saved feature names
- Database-aware health/monitoring endpoint
- Basic API tests and Docker packaging

## Run
```bash
python -m venv venv
# Windows:
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Open `http://127.0.0.1:8000/docs`.

## Train model
Run from this backend folder. Replace column names with the exact names in the cleaned dataset:
```bash
python train_model.py --data ../data/processed/cleaned_solar_data.csv --features irradiance temperature humidity wind_speed --target energy_output
```
The current prediction endpoint accepts these four named input fields. If the dataset uses different names, rename them in the training command or update the API schema/mapping consistently.

After training while the server is running, call `POST /model/reload` once to load the newly generated model.

## Endpoints
- `GET /` - project information
- `GET /health` - backend, model and database status
- `GET /monitor` - service status and record count
- `POST /readings` - store a measured solar reading
- `GET /readings` - list saved readings
- `GET /readings/latest` - latest reading
- `POST /predict` - predict energy output and store prediction
- `POST /model/reload` - reload trained model

Fault detection is not implemented in this phase; it remains future scope.
