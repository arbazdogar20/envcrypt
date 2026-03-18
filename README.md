# Envcrypt

> Secure environment variable management for developers and small teams.

Stop sharing secrets over Slack. Envcrypt gives your team one encrypted vault to store, share, and sync environment variables — pulled instantly with a single CLI command.

---

## The Problem

Every developer has done this:

- Pasted a database URL into a Slack message
- Emailed a `.env` file to a new teammate
- Committed secrets to Git by accident
- Spent 20 minutes hunting down an API key from 3 months ago

Envcrypt fixes all of it.

---

## Features

- **AES-256-GCM encryption** — secrets are encrypted at rest. A leaked database is useless without the master key.
- **CLI first** — pull secrets into your `.env` with one command. Push your local file to sync with the team.
- **Per-environment** — separate secrets for `development`, `staging`, and `production`.
- **Team access control** — invite teammates with `OWNER`, `EDITOR`, or `VIEWER` roles.
- **Audit logs** — every access and change is logged with user, IP, and timestamp.
- **Web dashboard** — manage projects, secrets, and team members from a clean UI.

---

## Tech Stack

| Layer          | Technology                   |
| -------------- | ---------------------------- |
| Backend API    | NestJS + TypeScript          |
| Database       | PostgreSQL via Prisma ORM    |
| Encryption     | AES-256-GCM (Node.js crypto) |
| Auth           | JWT + bcrypt                 |
| Frontend       | Next.js 16 + Tailwind CSS    |
| State          | Zustand + React Query        |
| CLI            | Node.js + Commander.js       |
| Infrastructure | Docker + Docker Compose      |

---

## Project Structure

```
envcrypt/
├── apps/
│   ├── api/          # NestJS backend
│   │   ├── src/
│   │   │   ├── auth/
│   │   │   ├── encryption/
│   │   │   ├── projects/
│   │   │   ├── secrets/
│   │   │   ├── users/
│   │   │   └── prisma/
│   │   └── prisma/
│   │       └── schema.prisma
│   ├── web/          # Next.js dashboard + landing page
│   │   └── src/
│   │       ├── app/
│   │       ├── components/
│   │       ├── hooks/
│   │       └── store/
│   └── cli/          # npx envcrypt CLI tool
│       └── src/
│           ├── commands/
│           └── lib/
└── docker-compose.yml
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- Docker Desktop
- Git

### 1. Clone the repository

```bash
git clone https://github.com/arbazdogar20/envcrypt.git
cd envcrypt
```

### 2. Start the database

```bash
docker-compose up -d
```

This starts PostgreSQL on port `5432` and Redis on port `6379`.

### 3. Configure the API

```bash
cd apps/api
cp .env.example .env
```

Open `.env` and fill in the values:

```bash
DATABASE_URL="postgresql://envcrypt:envcrypt_secret@localhost:5432/envcrypt_db"
JWT_SECRET="your-jwt-secret-here"
MASTER_ENCRYPTION_KEY="your-64-char-hex-key-here"
```

Generate a secure master key:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. Run database migrations

```bash
cd apps/api
npx prisma migrate dev
npx prisma generate
```

### 5. Start the API

```bash
cd apps/api
npm run start:dev
```

API runs on `http://localhost:3000`.

### 6. Start the web dashboard

```bash
cd apps/web
npm run dev
```

Dashboard runs on `http://localhost:3001`.

### 7. Install the CLI

```bash
cd apps/cli
npm install
npm run build
npm link
```

---

## CLI Usage

### Authentication

```bash
# Log in to your Envcrypt account
envcrypt login

# Log out
envcrypt logout
```

### Managing secrets

```bash
# Pull secrets into a local .env file
envcrypt pull --project my-app --env development

# Pull production secrets into a custom file
envcrypt pull --project my-app --env production --output .env.production

# Push a local .env file to Envcrypt
envcrypt push --project my-app --env development

# Push from a custom file
envcrypt push --project my-app --env staging --input .env.staging

# List secrets (values hidden by default)
envcrypt list --project my-app --env development

# List secrets with values revealed
envcrypt list --project my-app --env production --reveal
```

### Typical developer workflow

```bash
# New developer joins the team
envcrypt login
envcrypt pull --project my-app --env development
npm run dev   # everything works immediately
```

---

## API Reference

### Auth

| Method | Endpoint         | Description       |
| ------ | ---------------- | ----------------- |
| POST   | `/auth/register` | Create account    |
| POST   | `/auth/login`    | Login and get JWT |
| GET    | `/auth/me`       | Get current user  |

### Projects

| Method | Endpoint                      | Description            |
| ------ | ----------------------------- | ---------------------- |
| GET    | `/projects`                   | List all your projects |
| POST   | `/projects`                   | Create a project       |
| GET    | `/projects/:slug`             | Get project details    |
| DELETE | `/projects/:slug`             | Delete a project       |
| POST   | `/projects/:slug/members`     | Invite a team member   |
| DELETE | `/projects/:slug/members/:id` | Remove a team member   |

### Secrets

| Method | Endpoint                               | Description                        |
| ------ | -------------------------------------- | ---------------------------------- |
| GET    | `/projects/:slug/secrets/:env`         | Get all secrets for an environment |
| POST   | `/projects/:slug/secrets/:env`         | Create or update a secret          |
| POST   | `/projects/:slug/secrets/:env/bulk`    | Bulk create or update secrets      |
| DELETE | `/projects/:slug/secrets/:env/:key`    | Delete a secret                    |
| GET    | `/projects/:slug/secrets/environments` | List all environments              |

### Example request

```bash
# Get development secrets
curl http://localhost:3000/projects/my-app/secrets/development \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Add a secret
curl -X POST http://localhost:3000/projects/my-app/secrets/development \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"key": "DATABASE_URL", "value": "postgresql://localhost:5432/mydb"}'
```

---

## Security

### How encryption works

Every secret value is encrypted using **AES-256-GCM** before being stored in the database:

1. A master key is derived from `MASTER_ENCRYPTION_KEY` using `scrypt`
2. A random 16-byte IV is generated for every encryption operation
3. The value is encrypted and a 16-byte authentication tag is produced
4. The IV + auth tag + ciphertext are concatenated and stored as Base64

GCM mode provides **authenticated encryption** — it detects any tampering with the ciphertext. Even with full database access, secrets cannot be decrypted without the master key.

### What we never do

- Never store the master key in the database
- Never log decrypted secret values
- Never reuse an IV
- Never store raw API tokens — only hashed values

### Roles

| Role   | Read secrets | Write secrets | Manage members | Delete project |
| ------ | ------------ | ------------- | -------------- | -------------- |
| OWNER  | ✅           | ✅            | ✅             | ✅             |
| EDITOR | ✅           | ✅            | ❌             | ❌             |
| VIEWER | ✅           | ❌            | ❌             | ❌             |

---

## Environment Variables

### API (`apps/api/.env`)

| Variable                | Description                       | Required |
| ----------------------- | --------------------------------- | -------- |
| `DATABASE_URL`          | PostgreSQL connection string      | ✅       |
| `JWT_SECRET`            | Secret for signing JWT tokens     | ✅       |
| `MASTER_ENCRYPTION_KEY` | Master key for AES-256 encryption | ✅       |

### Web (`apps/web/.env.local`)

| Variable              | Description           | Required |
| --------------------- | --------------------- | -------- |
| `NEXT_PUBLIC_API_URL` | URL of the NestJS API | ✅       |

---

## Database Schema

```
users
  id, email, passwordHash, displayName, isEmailVerified

projects
  id, name, slug, ownerId

project_members
  id, projectId, userId, role (OWNER | EDITOR | VIEWER)

secrets
  id, projectId, environment, key, value (encrypted)

audit_logs
  id, userId, projectId, action, resource, metadata, ipAddress
```

---

## Roadmap

- [ ] GitHub Actions integration
- [ ] Secret versioning and history
- [ ] Webhook notifications on secret changes
- [ ] Import from `.env` file via dashboard
- [ ] Two-factor authentication
- [ ] Secret expiry dates
- [ ] Stripe billing integration

---

## Contributing

Pull requests are welcome. For major changes please open an issue first.

```bash
# Fork and clone
git clone https://github.com/arbazdogar20/envcrypt.git

# Create a feature branch
git checkout -b feature/your-feature

# Make your changes, then
git commit -m "feat: your feature description"
git push origin feature/your-feature
```

---

## License

MIT — see [LICENSE](./LICENSE) for details.
