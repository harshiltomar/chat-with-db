## Chat with DB (Next.js + OpenAI GPT‑5 + Turso SQLite + Drizzle ORM)

### Overview
Production-ready Next.js App Router template to build an AI chat interface that can read/write to your database. It uses:
- OpenAI GPT‑5 for reasoning and natural language
- Turso (libSQL/SQLite over HTTP) as the primary database
- Drizzle ORM + drizzle-kit for schema, type-safe queries, and migrations
- Shadcn UI, Radix UI, and Tailwind CSS for polished UI

### Features
- Server-first architecture with React Server Components (RSC)
- Chat orchestration on the server; minimal `use client`
- Drizzle schema + migrations tracked in repo
- Turso-ready connection and local dev via `libsql`
- Clean API boundaries: all server actions and route handlers under `app/api`
- URL state via `nuqs` (for filters, chat ids, etc.)

## Tech Stack
- **Runtime**: Next.js (App Router), TypeScript
- **AI**: OpenAI GPT‑5 API
- **DB**: Turso (libSQL/SQLite)
- **ORM**: Drizzle ORM + drizzle-kit
- **UI**: Shadcn UI, Radix UI, Tailwind CSS

## Getting Started

### 1) Prerequisites
- Node.js 18+
- Turso CLI (optional but recommended) and an account
- OpenAI API key with GPT‑5 access

### 2) Install dependencies
```bash
npm install
# or
pnpm install
```

### 3) Environment variables
Create a `.env` file at the project root:
```bash
cp .env.example .env
```
Then fill in the values:
```bash
# OpenAI
OPENAI_API_KEY="sk-..."

# Turso / libSQL
# For remote Turso
DATABASE_URL="libsql://<database-name>-<org>.turso.io"
DATABASE_AUTH_TOKEN="<turso-auth-token>"

# For local (if using libsql local server)
# DATABASE_URL="file:./.local/sqlite.db"   # example local file path

# Drizzle (optional overrides)
DRIZZLE_LOG="true"
```

Notes:
- If using Turso, set both `DATABASE_URL` and `DATABASE_AUTH_TOKEN`.
- If developing locally with a file SQLite, you only need `DATABASE_URL` pointing to a file path.

## Database & ORM

### Drizzle schema
Place your schema in `db/schema.ts` and Drizzle config in `drizzle.config.ts`. Example `drizzle.config.ts` contents:
```ts
import type { Config } from "drizzle-kit";

export default {
  schema: "./db/schema.ts",
  out: "./drizzle",
  dialect: "turso", // libsql/turso
  dbCredentials: {
    url: process.env.DATABASE_URL!,
    authToken: process.env.DATABASE_AUTH_TOKEN,
  },
} satisfies Config;
```

### Migrations
Generate and apply migrations:
```bash
# generate SQL from schema changes
npx drizzle-kit generate

# push migrations to the database
npx drizzle-kit push
```

### Seeding (optional)
Add a seed script under `scripts/seed.ts` and run with:
```bash
npx tsx scripts/seed.ts
```

## Development
```bash
npm run dev
# or
pnpm dev
```
Visit `http://localhost:3000`.

### Project structure
```
app/
├── (auth)/
├── (rbac)/
├── (landing)/
├── (shared)/
└── api/

components/
├── ui/
├── forms/
├── navigation/
├── dashboard/
└── [feature]/
```

Guidelines:
- Prefer RSC; limit `use client` to components that require browser APIs.
- Keep all server logic in `app/api` or server actions.
- Centralize AI calls and DB access to server utilities.

## AI Orchestration
- Use server actions or `app/api/chat/route.ts` to call OpenAI GPT‑5.
- Stream responses to the client via Edge runtime or Node streams (as desired).
- Store conversations, messages, and tool-call outputs in the database via Drizzle.

Example server-side call outline:
```ts
import OpenAI from "openai";

export async function generateChatReply(messages: { role: "system"|"user"|"assistant"; content: string; }[]) {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const completion = await openai.chat.completions.create({
    model: "gpt-5",
    messages,
    temperature: 0.2,
    stream: false,
  });
  return completion.choices[0]?.message?.content ?? "";
}
```

## UI & Styling
- Shadcn UI components in `components/ui`
- Tailwind for layout; mobile-first and responsive
- Prefer declarative JSX; small client components wrapped in `Suspense`

## URL State with nuqs
- Use `nuqs` for shareable query-parameter state (e.g., `chatId`, filters)
- Keep client state minimal; prefer server-derived data

## Scripts
Common scripts (adjust as needed in `package.json`):
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "drizzle:generate": "drizzle-kit generate",
    "drizzle:push": "drizzle-kit push",
    "seed": "tsx scripts/seed.ts"
  }
}
```

## Deployment
- Recommended: Vercel (Next.js native)
- Set environment variables in your hosting provider:
  - `OPENAI_API_KEY`
  - `DATABASE_URL`
  - `DATABASE_AUTH_TOKEN` (if using Turso)
- Run `drizzle-kit push` during deploy (build step or postdeploy) to keep schema in sync

## Troubleshooting
- DB auth errors: verify `DATABASE_URL` and `DATABASE_AUTH_TOKEN`; check Turso region and tokens
- Drizzle generate/push not picking changes: ensure `schema` path in `drizzle.config.ts` is correct
- OpenAI errors: confirm GPT‑5 access and correct model name; rate limits may apply
- Edge runtime stream issues: consider Node runtime fallback (`runtime = "nodejs"`) for server routes

## License
MIT

# chat-with-db
