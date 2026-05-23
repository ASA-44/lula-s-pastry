# Lula's Pastry Next.js

Responsive Next.js and TypeScript version of the Lula's Pastry project.

## Run the project

```bash
npm.cmd install
npm.cmd run dev
```

Open `http://127.0.0.1:3001`.

## Database

The MySQL dump is included at:

```text
database/lulas_pastry.sql
```

The app reads the database connection from `.env.local` and expects the XAMPP MySQL database name to be `lulas_pastry`.

Test accounts:

```text
Admin: lula@lulaspastry.com / lula12345
Customer: test@example.com / test123
Chef: ahmed@lulas.com / 12345
```

All roles use the same login page at `/login`. Only the admin account can add new chef accounts.
