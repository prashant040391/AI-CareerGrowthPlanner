# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **AI Integration**: Anthropic Claude via Replit AI Integrations (`claude-sonnet-4-6`)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## AI Career Growth Planner

### Artifacts

- **`artifacts/career-planner`** (`@workspace/career-planner`) — React + Vite frontend, served at `/`
- **`artifacts/api-server`** (`@workspace/api-server`) — Express backend, served at `/api`

### Features

- Upload PDF resume (multer handles multipart form data)
- Extract text from PDF (pdf-parse)
- AI analysis via Claude API (claude-sonnet-4-6) through Replit AI Integrations
- 3-page app: Landing → Analyze → Results
- Results dashboard with 6 card components: ProfileSummary, CareerMatch, Strengths, SkillGaps, Roadmap, SalaryInsights
- Copy summary to clipboard and start new analysis actions

### Backend Routes

- `POST /api/analyze` — accepts multipart form (resume PDF + form fields), returns structured JSON
- `GET /api/analyze/mock` — returns demo data for testing
- `GET /api/healthz` — health check

### Environment Variables

- `AI_INTEGRATIONS_ANTHROPIC_BASE_URL` — set by Replit AI Integrations
- `AI_INTEGRATIONS_ANTHROPIC_API_KEY` — set by Replit AI Integrations

### Libraries Added

- `multer` + `@types/multer` — file upload handling
- `pdf-parse` + `@types/pdf-parse` — PDF text extraction
- `@workspace/integrations-anthropic-ai` — Anthropic SDK wrapper (lib/integrations-anthropic-ai)
