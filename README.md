# Kafi Bun Backend

NestJS REST API for Kafi Bun, backed by PostgreSQL and Prisma.

## Setup

```bash
npm install
cp .env.example .env
npm run prisma:generate
npm run prisma:migrate -- --name init
npm run prisma:seed
npm run start:dev
```

API base URL: `http://localhost:4000`

## Troubleshooting

### EPERM: operation not permitted (Windows)
If you encounter an EPERM error while running Prisma commands (like `db push` or `generate`), it's likely because the Prisma engine is locked by a running process.
To fix:
1. Stop any running backend servers.
2. Delete the `node_modules/.prisma` directory.
3. Run `npx prisma generate` followed by your desired command.

## Useful Endpoints

- `GET /health`
- `GET /categories`
- `GET /products`
- `GET /products/:id`
- `GET /products/category/:categoryId`
- `GET /offers`
- `POST /orders`

Admin endpoints are grouped under `/admin`. A temporary `x-admin-key` guard is included and can be replaced later with JWT/session auth.
