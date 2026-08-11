.DEFAULT_GOAL := help

.PHONY: help setup dev-up dev-down db-up db-logs api-logs backend-lint backend-format-check backend-type-check backend-test compose-check

help: ## Show available commands
	@awk 'BEGIN {FS = ":.*## "; printf "DevInsight development commands:\n\n"} /^[a-zA-Z_-]+:.*## / {printf "  %-16s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

setup: ## Create a local .env file when one does not exist
	@test -f .env || cp .env.example .env

db-up: setup ## Start PostgreSQL in the background
	docker compose up -d db

dev-up: setup ## Build and start PostgreSQL and the API
	docker compose up -d --build db api

dev-down: ## Stop local services
	docker compose down

db-logs: ## Follow PostgreSQL logs
	docker compose logs -f db

api-logs: ## Follow API logs
	docker compose logs -f api

backend-lint: ## Run backend linting
	docker compose run --rm api ruff check .

backend-format-check: ## Check backend formatting
	docker compose run --rm api ruff format --check .

backend-type-check: ## Run strict backend type checking
	docker compose run --rm api mypy app

backend-test: ## Apply migrations and run backend tests
	docker compose run --rm api sh -c "alembic upgrade head && pytest"

compose-check: ## Validate the Docker Compose configuration
	docker compose --env-file .env.example config --quiet
