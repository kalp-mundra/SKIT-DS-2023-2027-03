# Heliq backend deployment notes

## Local verification
From the `backend` directory:
```bash
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```
Open `http://127.0.0.1:8000/docs`.

## Docker
Build from the `backend` directory:
```bash
docker build -t heliq-backend .
docker run -p 8000:8000 heliq-backend
```

## Before public deployment
- Train the model and place `models/solar_energy_model.pkl` in the backend folder.
- Use a persistent database volume or switch DATABASE_URL to PostgreSQL.
- Restrict or remove `/model/reload` from public access.
- Configure CORS for the actual frontend origin if browser requests require it.
- Add authentication and secrets management before exposing write endpoints.
- Confirm target energy units and feature units match the training dataset.
