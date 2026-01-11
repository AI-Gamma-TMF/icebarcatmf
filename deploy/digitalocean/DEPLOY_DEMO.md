### Goal
Get a **fully working demo** on DigitalOcean with:
- Backend API + Socket.IO
- Admin frontend
- Postgres + Redis + Elasticsearch
- Demo seed data (includes default admin user)

This repo already contains seeders (including `admin@moneyfactory.com`) and scripts like `npm run migrate:init`.

---

### Option A (Recommended for “all features + demo data”): DigitalOcean Droplet + Docker Compose

**Why this is best for a demo**
- No TLS/managed-service quirks (Redis + Elastic run locally in the droplet)
- Easy one-command reset to get demo data

**Steps**
1. Create a Droplet (Ubuntu LTS, e.g. 22.04) with enough RAM (4GB+ recommended because Elasticsearch is heavy).
2. Install Docker + Compose on the droplet.
3. Clone this repo onto the droplet.
4. From the repo root, run:

```bash
docker compose -f docker-compose.demo.yml up -d
```

5. Open the admin UI:
- `http://<DROPLET_IP>:8003/admin/signin`

**Default demo admin**
- Email: `admin@moneyfactory.com`
- Password: `admin` (the UI sends base64; the seeded bcrypt hash matches the project’s expected demo password)

**Notes**
- `docker-compose.demo.yml` runs `npm run migrate:init` automatically on backend container startup. For a clean reset, delete volumes and re-up:

```bash
docker compose -f docker-compose.demo.yml down -v
docker compose -f docker-compose.demo.yml up -d
```

---

### Option B (More “managed DO”): App Platform + Managed DBs + Spaces

Use this if you want DO-managed Postgres/Redis/Opensearch/Spaces. You’ll still need to:
- Run migrations + seeders once (App Platform “Job” component or a one-off task runner)
- Provide real credentials for email/payment integrations if you want those flows working

**Important compatibility notes**
- **Redis**: many managed Redis offerings require TLS. This repo now supports it via:
  - `REDIS_DB_TLS=true`
- **Spaces (S3-compatible)**: requires an endpoint. This repo now supports it via:
  - `S3_ENDPOINT=https://<region>.digitaloceanspaces.com`
- **Search**: code uses `@elastic/elasticsearch`. DO provides **OpenSearch**; it may work in practice (API-compatible for many operations), but if you hit incompatibilities, use Elasticsearch in a droplet for the demo.

