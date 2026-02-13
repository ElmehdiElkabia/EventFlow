.PHONY: help build up down logs restart clean migrate seed test lint format dev

help:
	@echo "EventFlow Docker Makefile Commands:"
	@echo ""
	@echo "Build & Start:"
	@echo "  make build              - Build Docker images"
	@echo "  make up                 - Start all containers"
	@echo "  make down               - Stop all containers"
	@echo "  make restart            - Restart all containers"
	@echo ""
	@echo "Database:"
	@echo "  make migrate            - Run database migrations"
	@echo "  make migrate-fresh      - Reset and re-run all migrations"
	@echo "  make seed               - Seed the database"
	@echo "  make migrate-seed       - Migrate and seed in one command"
	@echo ""
	@echo "Development:"
	@echo "  make dev                - Start development environment"
	@echo "  make logs               - View all container logs"
	@echo "  make logs-app           - View app container logs"
	@echo "  make logs-frontend      - View frontend container logs"
	@echo ""
	@echo "Code Quality:"
	@echo "  make lint               - Run linters"
	@echo "  make format             - Format code"
	@echo "  make test               - Run tests"
	@echo ""
	@echo "Utils:"
	@echo "  make shell-app          - Open app container shell"
	@echo "  make shell-frontend     - Open frontend container shell"
	@echo "  make clean              - Remove containers, volumes, and images"
	@echo "  make fresh              - Full clean rebuild and setup"
	@echo ""

build:
	docker-compose build

up:
	docker-compose up -d
	@echo "✓ Containers started"
	@echo "Frontend: http://localhost:5173"
	@echo "Backend API: http://localhost:8000"
	@echo "PhpMyAdmin: http://localhost:8080"

down:
	docker-compose down
	@echo "✓ Containers stopped"

restart:
	docker-compose restart
	@echo "✓ Containers restarted"

logs:
	docker-compose logs -f

logs-app:
	docker-compose logs -f app

logs-frontend:
	docker-compose logs -f frontend

migrate:
	docker-compose exec app php artisan migrate

migrate-fresh:
	docker-compose exec app php artisan migrate:fresh

seed:
	docker-compose exec app php artisan db:seed

migrate-seed: migrate seed
	@echo "✓ Database migrated and seeded"

dev: up
	@echo "✓ Development environment started"
	@echo "Waiting for services to be healthy..."
	@sleep 5
	@if [ ! -f backend/.env ]; then \
        cp backend/.env.example backend/.env 2>/dev/null || touch backend/.env; \
    fi
	@docker-compose exec -T app php artisan key:generate || true
	@echo "✓ Ready to develop!"

lint:
	docker-compose exec app ./vendor/bin/pint --test
	docker-compose exec frontend npm run lint

format:
	docker-compose exec app ./vendor/bin/pint
	docker-compose exec frontend npm run lint -- --fix

test:
	docker-compose exec app php artisan test

shell-app:
	docker-compose exec app bash

shell-frontend:
	docker-compose exec frontend sh

clean:
	docker-compose down -v
	docker image rm eventflow_app eventflow_frontend 2>/dev/null || true
	@echo "✓ Containers, volumes, and images removed"

fresh: clean build dev migrate-seed
	@echo "✓ Fresh environment ready!"

composer-install:
	docker-compose exec app composer install

npm-install:
	docker-compose exec frontend npm install

tinker:
	docker-compose exec app php artisan tinker

queue-work:
	docker-compose exec app php artisan queue:work

storage-link:
	docker-compose exec app php artisan storage:link

cache-clear:
	docker-compose exec app php artisan cache:clear
	docker-compose exec app php artisan config:clear
	docker-compose exec app php artisan route:clear
	docker-compose exec app php artisan view:clear
