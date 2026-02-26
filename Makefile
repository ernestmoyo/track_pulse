.PHONY: dev build migrate seed studio docker-up docker-down install lint format

install:
	pnpm install

dev:
	pnpm dev

dev-web:
	pnpm dev:web

dev-api:
	pnpm dev:api

build:
	pnpm build

migrate:
	pnpm db:migrate

seed:
	pnpm db:seed

generate:
	pnpm db:generate

studio:
	pnpm db:studio

docker-up:
	docker compose up -d

docker-down:
	docker compose down

lint:
	pnpm lint

format:
	pnpm format
