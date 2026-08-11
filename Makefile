.DEFAULT_GOAL := help

.PHONY: help setup db-up db-down db-logs compose-check

help: ## Show available commands
	@awk 'BEGIN {FS = ":.*## "; printf "DevInsight development commands:\n\n"} /^[a-zA-Z_-]+:.*## / {printf "  %-16s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

setup: ## Create a local .env file when one does not exist
	@test -f .env || cp .env.example .env

db-up: setup ## Start PostgreSQL in the background
	docker compose up -d db

db-down: ## Stop local services
	docker compose down

db-logs: ## Follow PostgreSQL logs
	docker compose logs -f db

compose-check: ## Validate the Docker Compose configuration
	docker compose --env-file .env.example config --quiet
