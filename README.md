# TrackPulse

**Brand Health Intelligence Platform** by TrackField Projects

> "Your brand's vital signs, every quarter."

## Quick Start

### Prerequisites
- Node.js >= 18
- pnpm >= 8
- Docker & Docker Compose (for PostgreSQL + Redis)

### Setup

```bash
# 1. Install dependencies
pnpm install

# 2. Start database services
docker compose up -d

# 3. Run database migrations
pnpm db:generate
pnpm db:migrate

# 4. Seed demo data
pnpm db:seed

# 5. Start development servers
pnpm dev
```

- **Frontend:** http://localhost:5173
- **API:** http://localhost:3001
- **pgAdmin:** http://localhost:5050

### Demo Credentials

| Email | Password | Role |
|---|---|---|
| admin@trackfield.com | TrackField@2024 | ADMIN |
| analyst@trackfield.com | Analyst@2024 | ANALYST |
| panagora@client.mu | Client@2024 | CLIENT_VIEWER |

## Tech Stack

- **Frontend:** React 18 + TypeScript + Vite + Tailwind CSS + Framer Motion + Recharts
- **Backend:** Node.js + Express + TypeScript + Prisma + PostgreSQL + Redis
- **Auth:** JWT + bcrypt
- **Reports:** PptxGenJS (PowerPoint export)
- **State:** Zustand
- **Forms:** React Hook Form + Zod

## Project Structure

```
trackpulse/
├── apps/
│   ├── web/          # React frontend (Vite)
│   └── api/          # Express backend
├── packages/
│   └── shared/       # Shared TypeScript types
├── docker-compose.yml
└── package.json
```

---

*TrackPulse — 7Square Inc. / TrackField Projects*
