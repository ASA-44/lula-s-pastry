# Lula's Pastry Next.js

Responsive Next.js and TypeScript version of the Lula's Pastry project.

## Tech stack

Frontend:
- React
- Next.js App Router
- Tailwind CSS

Backend:
- Node.js
- Next.js route handlers
- REST API

Database:
- MySQL with `mysql2`

## Run the project

```bash
npm.cmd install
npm.cmd run dev
```

Open `http://127.0.0.1:3001`.

Use `.env.example` as the template for `.env.local`.

## Database

The MySQL dump is included at:

```text
database/lulas_pastry.sql
```

The app reads the database connection from `.env.local` and expects the XAMPP MySQL database name to be `lulas_pastry`.

## REST API

The app includes Next.js REST API routes:

```text
GET /api/dishes
GET /api/dishes?category=pastries
POST /api/password-check
```

`/api/dishes` reads available products from the MySQL database.

Test accounts:

```text
Admin: lula@lulaspastry.com / Lula@12345
Customer: test@example.com / test123
Chef: ahmed@lulas.com / 12345
```

All existing users use the same login page at `/login`. New customers create an account at `/signin`.
Only the admin account can add new chef accounts.
