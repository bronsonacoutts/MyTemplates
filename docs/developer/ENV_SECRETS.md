# Environment Variables & Secrets Guide

> This guide documents all environment variables used by the project, how to configure them locally, and how to manage secrets securely.

---

## Golden Rules

1. **Never commit secrets.** API keys, passwords, tokens, and credentials must never appear in source code or git history.
2. **Use `.env` for local development.** The `.env` file is always in `.gitignore`.
3. **Use `.env.example` as the template.** This file is committed and shows all required variables with placeholder values.
4. **Use CI secrets for pipelines.** Store secrets in GitHub Actions secrets, never in workflow files.
5. **Rotate compromised secrets immediately.** If a secret is accidentally committed, treat it as compromised — rotate it even after removing it from git history.

---

## Local Setup

1. Copy the example file:
   ```bash
   cp .env.example .env
   ```
2. Fill in the actual values for your local environment.
3. Never share your `.env` file.

---

## Environment Variables Reference

> Update this table whenever a new environment variable is added to the project.

### Application Variables

| Variable    | Required | Default       | Description                                               |
| ----------- | -------- | ------------- | --------------------------------------------------------- |
| `NODE_ENV`  | Yes      | `development` | Runtime environment (`development`, `test`, `production`) |
| `PORT`      | No       | `3000`        | HTTP server port                                          |
| `LOG_LEVEL` | No       | `info`        | Logging verbosity (`error`, `warn`, `info`, `debug`)      |

### Database Variables

| Variable             | Required   | Default | Description                     |
| -------------------- | ---------- | ------- | ------------------------------- |
| `DATABASE_URL`       | Yes (prod) | —       | Full database connection string |
| `DATABASE_POOL_SIZE` | No         | `10`    | Connection pool size            |

### Authentication Variables

| Variable              | Required    | Default | Description                                      |
| --------------------- | ----------- | ------- | ------------------------------------------------ |
| `JWT_SECRET`          | Yes         | —       | Secret key for JWT signing (min 32 chars)        |
| `JWT_EXPIRES_IN`      | No          | `1h`    | JWT expiry duration                              |
| `OAUTH_CLIENT_ID`     | Conditional | —       | OAuth2 client ID (required if OAuth enabled)     |
| `OAUTH_CLIENT_SECRET` | Conditional | —       | OAuth2 client secret (required if OAuth enabled) |

### External Services

| Variable         | Required    | Default | Description                                      |
| ---------------- | ----------- | ------- | ------------------------------------------------ |
| `API_BASE_URL`   | Yes         | —       | Base URL for downstream API                      |
| `API_KEY`        | Yes         | —       | API authentication key                           |
| `WEBHOOK_SECRET` | Conditional | —       | Shared secret for webhook signature verification |

---

## GitHub Actions Secrets

The following secrets must be configured in the repository settings under **Settings → Secrets and variables → Actions**:

| Secret Name    | Description                                                             |
| -------------- | ----------------------------------------------------------------------- |
| `GITHUB_TOKEN` | Automatically provided by GitHub Actions. No configuration needed.      |
| `NPM_TOKEN`    | npm publish token (required for release workflow if publishing to npm). |

To add a secret:

1. Go to your repository on GitHub.
2. Navigate to **Settings → Secrets and variables → Actions**.
3. Click **New repository secret**.
4. Enter the name and value.

---

## Validating Environment Variables at Startup

Use a validation library (e.g., `zod`) to validate environment variables at application startup. Fail fast with a clear error message if required variables are missing:

```typescript
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']),
  PORT: z.coerce.number().default(3000),
  JWT_SECRET: z.string().min(32),
  DATABASE_URL: z.string().url(),
});

export const env = envSchema.parse(process.env);
```

This prevents the application from starting with a misconfigured environment.

---

## What To Do If a Secret Is Compromised

1. **Immediately rotate the secret** — generate a new value in the relevant service (API provider, database, etc.).
2. **Update CI secrets** — go to repository settings and update the secret value.
3. **Update `.env` on all developer machines** — notify the team.
4. **Remove from git history** — use `git filter-repo` or contact GitHub Support if pushed to a remote. Note: the secret should still be considered compromised even after removal.
5. **Audit access logs** — check if the secret was used maliciously.
6. **Report if sensitive** — if customer data may be at risk, follow the incident response process in `SECURITY.md`.
