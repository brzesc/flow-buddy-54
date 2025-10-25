.PHONY: help install build dev up down logs clean seed migrate test

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-15s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

install: ## Install all dependencies
	npm install
	cd backend && npm install

build: ## Build all services
	docker compose build

dev: ## Start development environment
	docker compose up -d db redis
	cd backend && npm run prisma:generate && npm run dev &
	npm run dev

up: ## Start all Docker services
	docker compose up -d --build

down: ## Stop all Docker services
	docker compose down

logs: ## View logs from all services
	docker compose logs -f

clean: ## Remove all containers and volumes
	docker compose down -v
	rm -rf backend/node_modules
	rm -rf node_modules

seed: ## Seed the database with demo data
	docker compose exec backend npm run seed

migrate: ## Run database migrations
	docker compose exec backend npm run prisma:migrate:dev

migrate-deploy: ## Deploy migrations (production)
	docker compose exec backend npm run prisma:migrate:deploy

studio: ## Open Prisma Studio
	cd backend && npm run prisma:studio

test: ## Run all tests
	cd backend && npm test
	npm test

test-backend: ## Run backend tests
	cd backend && npm test

test-frontend: ## Run frontend tests
	npm test

ps: ## Show running containers
	docker compose ps

restart: ## Restart all services
	docker compose restart

shell-backend: ## Open shell in backend container
	docker compose exec backend sh

shell-db: ## Open PostgreSQL shell
	docker compose exec db psql -U postgres -d ordermanager
