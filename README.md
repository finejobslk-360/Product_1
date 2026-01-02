## Overview

This repository hosts the **360° Product 1** web application built with Next.js 16 (App Router) and TypeScript. The project ships with Tailwind CSS + shadcn/ui for UI primitives, Firebase for auth, and Prisma/PostgreSQL (database layer handled on a separate branch).

## Quick Start

```bash
npm install
cp env.example .env.local   # fill in real values afterwards
npm run dev
```

Visit `http://localhost:3000`.

## Environment Variables

All required variables live in `env.example`. Copy it to `.env.local` and fill in:

- `DATABASE_URL` (local Docker, Supabase, Neon, etc.)
- Firebase client config (`NEXT_PUBLIC_FIREBASE_*`)
- Firebase Admin credentials (`FIREBASE_*`)
- Optional overrides for session cookie name/max age.

> Database provisioning/migrations are coordinated on the dedicated database branch—do not run conflicting migrations here.

## Available Scripts

| Script                            | Description                               |
| --------------------------------- | ----------------------------------------- |
| `npm run dev`                     | Start the Next.js dev server.             |
| `npm run build`                   | Create a production build.                |
| `npm start`                       | Run the production server.                |
| `npm run lint`                    | Run `next lint` with `--max-warnings=0`.  |
| `npm run format` / `format:check` | Format or verify formatting via Prettier. |

### Git Hooks & Formatting

- Husky triggers `lint-staged` before commits (ESLint + Prettier on staged files).
- Update formatting rules via `.prettierrc`; ignored paths live in `.prettierignore`.

## UI & Theming

- Tailwind + shadcn/ui (`components.json`) manage the design system.
- Global tokens live in `src/app/globals.css`; Tailwind extensions are configured in `tailwind.config.ts`.
- Reusable primitives (Button, Input, Select, Card, Badge, Dialog) are in `src/components/ui`.

## Authentication & Sessions

- Firebase client SDK handles signup/signin; server routes verify ID tokens.
- Session cookies are issued via Firebase Admin and stored as HTTP-only cookies.
- `middleware.ts` reads/validates cookies to protect `/dashboard` and exposes the current user to downstream handlers.
- `/api/auth/signout` clears the session cookie.

## Outstanding Tasks

- Database creation, Prisma migrations, and `/api/auth/me` (which reads from Postgres) are handled on the database branch.
- GitHub remote setup (main/dev branches) plus Firebase console configuration should be completed manually—see internal deployment checklist.

## Contributing

1. Create a feature branch from `dev-sachithra`.
2. Keep commits focused (formatting fixes automatically run via Husky).
3. Open a PR and link it to the matching tracker item.

Need help? Ping the #product1 channel or check `DATABASE_SETUP.md` for DB troubleshooting notes.
