# Gina Ballerina Store

An online store project with a Next.js frontend and a Node.js/Express backend.

## Technology

| Layer | Stack |
| --- | --- |
| Frontend | Next.js 14, React 18, TypeScript, Tailwind CSS |
| Backend | Node.js, Express, JavaScript ES modules |
| Data tooling | PostgreSQL and SQLite dependencies |
| Integration dependencies | Stripe, Nodemailer and S3-compatible storage tooling |

Dependencies describe the tools included in the project; they do not imply that every integration is configured or production-ready.

## Repository structure

- `frontend/` — Next.js application and frontend package scripts.
- `backend/` — Express server and backend package scripts.
- `database/` — database-related project files.
- `public/` — additional public assets.
- `src/` — additional server/database source files.

## Development entry points

The project has separate frontend and backend packages. Review each application's configuration and database requirements before starting it.

Frontend, from `frontend/`:

```sh
npm install
npm run dev
```

Backend, from `backend/`:

```sh
npm install
npm run dev
```

The backend development script starts `nodemon src/index.js`. Its production start script is `npm start`. The frontend build script is `npm run build`.

Supply the environment variables required by the implementation for the database and any integrations you use. Keep credentials out of source control. A complete environment/setup guide and verified deployment instructions are not yet documented here.

## Developer

[Oiva Nekwaya](https://github.com/OivaNekwaya) · Full-Stack, Web & Mobile Developer
