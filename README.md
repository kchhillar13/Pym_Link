# Pym-Link

Advanced, centralized project link management system.

## Project Structure

- `./backend`: Node.js, Express, TypeScript, Prisma (PostgreSQL), Redis.
- `./frontend`: Next.js (App Router), TypeScript, Tailwind CSS, Lucide Icons.

## Setup Instructions

### Backend

1. Navigate to `backend/`
2. Install dependencies: `npm install`
3. Configure `.env` file:
   - `DATABASE_URL`: Your PostgreSQL connection string.
   - `REDIS_URL`: Your Redis connection string.
   - `JWT_SECRET`: A secure secret for signing tokens.
4. Generate Prisma client: `npx prisma generate`
5. Run migrations: `npx prisma migrate dev`
6. Start development server: `npm run dev`

### Frontend

1. Navigate to `frontend/`
2. Install dependencies: `npm install`
3. Configure `.env.local`:
   - `NEXT_PUBLIC_API_URL`: URL of your backend (default: `http://localhost:8001`)
4. Start development server: `npm run dev`

## Caching Strategy

Pym-Link uses a Cache-Aside pattern with Redis for high-throughput redirects.
- Key Format: `link:{username}:{project_slug}:{label}`
- TTL: 24 hours
- Cache Invalidation: Occurs immediately when a link is created/updated.

## Rate Limiting

Implemented using Redis sliding window:
- Redirects: 100 requests per minute per IP.
- Auth: 10 requests per minute per IP.
