from fastapi.testclient import TestClient


def test_not_found_uses_error_envelope(client: TestClient) -> None:
    response = client.get("/api/v1/does-not-exist")

    assert response.status_code == 404
    payload = response.json()
    assert payload["error"]["code"] == "not_found"
    assert payload["error"]["message"] == "Not Found"
    assert payload["error"]["details"] == {}
    assert payload["error"]["request_id"] == response.headers["x-request-id"]


def test_safe_client_request_id_is_preserved(client: TestClient) -> None:
    response = client.get(
        "/api/v1/health/live",
        headers={"X-Request-ID": "portfolio-test-123"},
    )

    assert response.headers["x-request-id"] == "portfolio-test-123"


def test_unsafe_client_request_id_is_replaced(client: TestClient) -> None:
    response = client.get(
        "/api/v1/health/live",
        headers={"X-Request-ID": "unsafe request id"},
    )

    assert response.headers["x-request-id"] != "unsafe request id"
