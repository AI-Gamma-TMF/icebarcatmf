# 🚀 QUICK START - LOCAL DEVELOPMENT

## Prerequisites
- Node.js v22.17.1 (backend) & v18.x (frontend) - Use `nvm` to manage versions
- PostgreSQL 15
- Redis 7
- Elasticsearch 8.2.1

---

## 🎬 OPTION 1: Quick Start with Docker (Recommended)

### Start Everything
```bash
cd /Users/amitdas/Desktop/Gamma_white/admin-end
docker compose -f docker-compose.demo.yml up -d
```

### Check Status
```bash
docker compose -f docker-compose.demo.yml ps
docker compose -f docker-compose.demo.yml logs -f backend
```

### Access
- **Frontend**: http://localhost:8003
- **Backend API**: http://localhost:8080
- **Login**: admin@moneyfactory.com / admin

### Stop Everything
```bash
docker compose -f docker-compose.demo.yml down
```

### Reset Database (Clean Start)
```bash
docker compose -f docker-compose.demo.yml down -v
docker compose -f docker-compose.demo.yml up -d
```

---

## 🛠️ OPTION 2: Manual Local Setup

### 1. Backend Setup

#### A. Create `.env` file (if missing)
```bash
cd /Users/amitdas/Desktop/Gamma_white/admin-end/backend
cat > .env << 'EOF'
NODE_ENV=development
PORT=8080
ORIGIN=true

# Database
DB_NAME=moneyfactory_demo
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_READ_HOST=localhost
DB_WRITE_HOST=localhost
DB_PORT=5432

# Redis
REDIS_DB_HOST=localhost
REDIS_DB_PORT=6379
REDIS_DB_PASSWORD=""
REDIS_DB_TLS=false

# Elasticsearch
ELASTIC_PROTOCALL=http://
ELASTIC_URL=localhost
ELASTIC_PORT=9200
ELASTIC_USER=elastic
ELASTIC_PASSWORD=changeme_demo

# JWT & Security
JWT_LOGIN_SECRET=demo-login-secret
VERIFICATION_TOKEN_SECRET=demo-verification-secret
SECRET_KEY=demo-secret-key
RESET_PASSWORD_KEY=demo-reset-password-key
EMAIL_TOKEN_KEY=demo-email-token-key
CREDENTIAL_ENCRYPTION_KEY=demo-credential-encryption-key

# Frontend URLs
USER_FRONTEND_URL=http://localhost:8003
ADMIN_FRONTEND_URL=http://localhost:8003
ADMIN_BE_URL=http://localhost:8080

# Optional Services (for testing)
PAYSAFE_BASE_URL=
PAYSAFE_API_USERNAME=
PAYSAFE_API_PASSWORD=
PAYSAFE_ACCOUNT_ID=
SEND_GRID_API_KEY=
SEND_GRID_BASE_URL=
SEND_GRID_FROM_EMAIL=
SEND_GRID_FROM_NAME=
S3_REGION=us-east-1
S3_ENDPOINT=
S3_BUCKET=
S3_ACCESS_KEY_ID=
S3_SECRET_ACCESS_KEY=
EOF
```

#### B. Install Dependencies & Setup Database
```bash
# Use correct Node version
nvm use 22.17.1

# Install packages
npm install

# Setup database (creates DB, runs migrations & seeders)
npm run migrate:init

# Or step by step:
# npm run migrate         # Run migrations
# npm run seed            # Run seeders
```

#### C. Start Backend
```bash
npm run start:dev
```

Backend should be running on http://localhost:8080

---

### 2. Frontend Setup

#### A. Create `.env` file (if missing)
```bash
cd /Users/amitdas/Desktop/Gamma_white/admin-end/frontend
cat > .env << 'EOF'
PORT=8003
REACT_APP_API_URL=http://localhost:8080
REACT_APP_SOCKET_URL=http://localhost:8080
EOF
```

#### B. Install Dependencies & Start
```bash
# Use correct Node version
nvm use 18

# Install packages
npm install

# Start frontend
npm start
```

Frontend should be running on http://localhost:8003

---

## ✅ Verify Everything Works

### 1. Check Backend Health
```bash
curl http://localhost:8080/health
```

### 2. Check Database
```bash
cd backend
npm run migrate:status
```

### 3. Login to Admin Panel
- Navigate to: http://localhost:8003/admin/signin
- Email: `admin@moneyfactory.com`
- Password: `admin`

---

## 🔧 Common Issues & Fixes

### Issue: Port Already in Use
```bash
# Find and kill process on port
lsof -ti:8080 | xargs kill -9  # Backend
lsof -ti:8003 | xargs kill -9  # Frontend
lsof -ti:5432 | xargs kill -9  # PostgreSQL
lsof -ti:6379 | xargs kill -9  # Redis
lsof -ti:9200 | xargs kill -9  # Elasticsearch
```

### Issue: Node Version Mismatch
```bash
# Install nvm if not installed
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Install & use correct versions
nvm install 22.17.1
nvm install 18

# Backend
cd backend && nvm use 22.17.1

# Frontend
cd frontend && nvm use 18
```

### Issue: Database Connection Failed
```bash
# Check PostgreSQL is running
pg_isready

# Start PostgreSQL (if using Homebrew)
brew services start postgresql@15

# Or check Docker
docker ps | grep postgres
```

### Issue: Redis Connection Failed
```bash
# Check Redis is running
redis-cli ping

# Start Redis (if using Homebrew)
brew services start redis

# Or check Docker
docker ps | grep redis
```

### Issue: Elasticsearch Connection Failed
```bash
# Check Elasticsearch is running
curl http://localhost:9200

# Start Elasticsearch (Docker recommended for local)
docker run -d -p 9200:9200 -e "discovery.type=single-node" docker.elastic.co/elasticsearch/elasticsearch:8.2.1
```

---

## 📝 Useful Commands

### Backend
```bash
# Check migration status
npm run migrate:status

# Run new migrations
npm run migrate

# Undo last migration
npm run migrate:undo

# Run all seeders
npm run seed

# Undo all seeders
npm run seed:undo

# Reset database (drop, create, migrate, seed)
npm run db:reset

# Run linter
npm run lint
```

### Frontend
```bash
# Build for production
npm run build

# Run linter
npm run lint

# Fix linting issues
npm run lint:fix
```

---

## 🐛 Debug Mode

### Backend with Inspector
```bash
cd backend
npm run start:dev
# Debugger listening on ws://0.0.0.0:9229
```

Attach your debugger to port 9229

### View Logs
```bash
# Backend logs
tail -f backend/logs/combined.log
tail -f backend/logs/error.log

# Docker logs
docker compose -f docker-compose.demo.yml logs -f backend
docker compose -f docker-compose.demo.yml logs -f frontend
```

---

## 📊 Test Data

### Default Admin User
- **Email**: admin@moneyfactory.com
- **Password**: admin

### Database Access
```bash
# Using psql
psql -h localhost -U postgres -d moneyfactory_demo

# Or with Docker
docker compose -f docker-compose.demo.yml exec postgres psql -U postgres -d moneyfactory_demo
```

---

## 🎯 Next Steps

1. Follow `LOCAL_TESTING_CHECKLIST.md` to test all features
2. Fix any issues you find
3. Once confirmed working, follow deployment guide
4. See `deploy/digitalocean/DEPLOY_DEMO.md` for production deployment

---

## 📞 Need Help?

- Check logs in `backend/logs/`
- Review error messages in browser console (F12)
- Check Docker container logs
- Verify all environment variables are set correctly
