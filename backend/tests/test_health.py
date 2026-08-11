import pytest
from fastapi.testclient import TestClient


def test_liveness_reports_service_version(client: TestClient) -> None:
    response = client.get("/api/v1/health/live")

    assert response.status_code == 200
    assert response.json() == {
        "status": "ok",
        "service": "DevInsight API",
        "version": "0.1.0",
    }
    assert response.headers["x-request-id"]


@pytest.mark.integration
def test_readiness_checks_postgresql(client: TestClient) -> None:
    response = client.get("/api/v1/health/ready")

    assert response.status_code == 200
    assert response.json() == {"status": "ready", "database": "reachable"}
