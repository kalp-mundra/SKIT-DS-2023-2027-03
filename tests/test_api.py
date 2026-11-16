from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["project"] == "Heliq"

def test_health_has_database_status():
    response = client.get("/health")
    assert response.status_code == 200
    assert "database_connected" in response.json()

def test_create_and_list_reading():
    payload = {
        "panel_id": "test-panel",
        "irradiance": 700,
        "temperature": 30,
        "humidity": 45,
        "wind_speed": 2.5,
        "actual_energy_output": 3.2
    }
    created = client.post("/readings", json=payload)
    assert created.status_code == 201
    assert created.json()["panel_id"] == "test-panel"

    listed = client.get("/readings?panel_id=test-panel")
    assert listed.status_code == 200
    assert len(listed.json()) >= 1
