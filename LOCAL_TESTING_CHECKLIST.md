# 🔍 LOCAL TESTING & DEPLOYMENT CHECKLIST
**Project**: Gamma White Admin End
**Date**: January 12, 2026

---

## 🎯 WORKFLOW
1. ✅ Test & fix locally
2. ✅ Confirm fixes work
3. ✅ Push to deployment
4. ✅ Verify in production

---

## 📋 PHASE 1: LOCAL TESTING

### **A. Environment Setup**
- [ ] Check all `.env` files exist (backend & frontend)
- [ ] Verify Node versions match:
  - Backend: Node v22.17.1
  - Frontend: Node v18.x
- [ ] Database services running:
  - [ ] PostgreSQL (port 5432)
  - [ ] Redis (port 6379)
  - [ ] Elasticsearch (port 9200)

### **B. Backend Issues to Check**
- [ ] Database connection working
- [ ] Migrations run successfully (`npm run migrate:status`)
- [ ] Seeders applied correctly (`npm run seed`)
- [ ] API endpoints responding
- [ ] Socket.IO connection working
- [ ] JWT authentication working
- [ ] Redis cache working
- [ ] Elasticsearch indexing working
- [ ] File upload (S3/local) working
- [ ] Email service configured (optional for local)
- [ ] Payment gateway configured (optional for local)
- [ ] Logs are clean (check `backend/logs/`)

#### **Common Backend Issues:**
1. **Payment Methods Seeder** - Currently open file
   - ✅ Fixed: Dynamic column detection for payment_provider vs payment_providers
2. **Port conflicts** - Check if ports 8080, 5432, 6379, 9200 are free
3. **Missing environment variables**
4. **Database connection errors**
5. **Migration/Seeder version mismatches**

### **C. Frontend Issues to Check**
- [ ] React app starts without errors
- [ ] API connection to backend working
- [ ] Socket.IO connection established
- [ ] Login/Authentication flow working
- [ ] Admin dashboard loads
- [ ] All routes accessible
- [ ] Forms submit correctly
- [ ] File uploads working
- [ ] Real-time updates via Socket.IO
- [ ] Charts/graphs rendering
- [ ] Internationalization (i18n) working
- [ ] No console errors in browser
- [ ] No eslint/lint errors

#### **Common Frontend Issues:**
1. **CORS errors** - Backend needs proper CORS setup
2. **API URL mismatch** - Check REACT_APP_API_URL
3. **Socket URL mismatch** - Check REACT_APP_SOCKET_URL
4. **Missing dependencies**
5. **Build errors**

### **D. Integration Testing**
- [ ] **Login Flow**
  - Default admin: `admin@moneyfactory.com` / `admin`
- [ ] **Dashboard**
  - All widgets load
  - Real-time data updates
- [ ] **User Management**
  - Create/Read/Update/Delete operations
- [ ] **Payment Processing**
  - Payment methods display correctly
- [ ] **File Upload**
  - Images/documents upload successfully
- [ ] **Reports & Analytics**
  - Data exports working
  - Charts rendering
- [ ] **Real-time Features**
  - Socket.IO events firing
  - Live notifications

---

## 📦 PHASE 2: PRE-DEPLOYMENT CHECKLIST

### **A. Code Quality**
- [ ] Run linter: `npm run lint` (backend & frontend)
- [ ] Fix all linting errors
- [ ] No TODO/FIXME comments left
- [ ] Remove console.logs (except logger)
- [ ] Remove debug code

### **B. Git & Version Control**
- [ ] All changes committed
- [ ] Meaningful commit messages
- [ ] Branch up to date with main/master
- [ ] `.env` files NOT committed (in .gitignore)
- [ ] Sensitive data removed from code

### **C. Docker & Deployment Prep**
- [ ] `docker-compose.demo.yml` tested locally
- [ ] All Docker images build successfully
- [ ] Environment variables configured for production
- [ ] Database backup created (if updating existing deployment)

---

## 🚀 PHASE 3: DEPLOYMENT TO DIGITALOCEAN

### **Option A: Docker Compose (Recommended)**
```bash
# On DigitalOcean Droplet
cd /path/to/admin-end
git pull origin main
docker compose -f docker-compose.demo.yml down
docker compose -f docker-compose.demo.yml up -d --build
```

### **Deployment Checklist**
- [ ] Git repository updated on server
- [ ] Docker containers rebuilt
- [ ] Migrations run on production DB
- [ ] Seeders run (if needed)
- [ ] Environment variables set correctly
- [ ] Ports accessible (8003 for frontend, 8080 for backend)
- [ ] Health check passes

---

## ✅ PHASE 4: PRODUCTION VERIFICATION

### **A. Basic Health Checks**
- [ ] Frontend loads: `http://<DROPLET_IP>:8003`
- [ ] Backend API responds: `http://<DROPLET_IP>:8080/health`
- [ ] Login works with demo credentials
- [ ] Dashboard displays correctly

### **B. Feature Verification**
- [ ] All issues fixed locally are also fixed in production
- [ ] No new errors in production logs
- [ ] Database queries performing well
- [ ] Socket.IO connections stable
- [ ] File uploads working
- [ ] Real-time features working

### **C. Performance Checks**
- [ ] Page load times acceptable
- [ ] API response times < 500ms
- [ ] No memory leaks
- [ ] Docker containers running stable

### **D. Security Checks**
- [ ] No sensitive data exposed
- [ ] HTTPS configured (if applicable)
- [ ] Strong passwords set
- [ ] Demo secrets changed for production
- [ ] Firewall rules configured

---

## 🐛 KNOWN ISSUES TO FIX

### **Issue 1: Payment Methods Seeder**
**File**: `backend/src/db/seeders/20220712114909-paymentMethods.js`
**Status**: ✅ Fixed (dynamic column detection)

### **Issue 2: Node Version Mismatch**
**Problem**: Backend expects 22.17.1, Frontend expects 18.x
**Solution**: Use nvm or Docker to manage versions

### **Issue 3: [Add more as we find them]**
- [ ] TBD

---

## 📝 TESTING COMMANDS

### **Backend**
```bash
cd backend
npm install
npm run migrate:status
npm run migrate
npm run seed
npm run start:dev
```

### **Frontend**
```bash
cd frontend
npm install
npm start
```

### **Docker (Full Stack)**
```bash
docker compose -f docker-compose.demo.yml up -d
docker compose -f docker-compose.demo.yml logs -f
```

---

## 🔗 USEFUL LINKS
- Backend Logs: `backend/logs/combined.log`
- Error Logs: `backend/logs/error.log`
- Deployment Docs: `deploy/digitalocean/DEPLOY_DEMO.md`

---

## ✅ SIGN-OFF
- [ ] **Local Testing Complete** - All issues fixed and tested locally
- [ ] **User Confirmation** - User has verified all fixes work
- [ ] **Deployed to Production** - Changes pushed to DigitalOcean
- [ ] **Production Verified** - All fixes confirmed working in production
- [ ] **Documentation Updated** - Any new changes documented

**Tested By**: _________________
**Date**: _________________
**Deployed By**: _________________
**Date**: _________________
