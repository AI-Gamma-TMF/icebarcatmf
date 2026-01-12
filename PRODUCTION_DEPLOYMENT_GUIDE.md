# Production Deployment Guide

## ✅ Step 1: Code Deployed (COMPLETED)

Your changes have been successfully pushed to GitHub:
- **Repository**: https://github.com/AI-Gamma-TMF/icebarcatmf.git
- **Branch**: `do-demo-deploy`
- **Commit**: `043c073` - Add demo staff data and fix staff page UI

## 🔄 Step 2: Wait for Auto-Deployment

DigitalOcean App Platform should automatically detect the push and start deploying:

1. **Check deployment status**:
   - Go to: https://cloud.digitalocean.com/apps
   - Find your app: `icebarcatmf-admin-demo`
   - Look for "Deploying" status
   - Wait for it to complete (usually 5-10 minutes)

2. **Monitor the build**:
   - Click on your app
   - Go to "Activity" tab
   - Watch the build logs

## 📊 Step 3: Populate Demo Data on Production

Once the deployment completes, you need to run the seeder to add the 11 demo staff members.

### Option A: Using DigitalOcean Console (Recommended)

1. **Access your app console**:
   ```
   https://cloud.digitalocean.com/apps/YOUR_APP_ID/console
   ```

2. **Select the backend component**

3. **Run the seeder**:
   ```bash
   npm run babel-node -- node_modules/.bin/sequelize-cli db:seed --seed 20260112000000-demo-staff-data.js
   ```

### Option B: Using doctl CLI

If you have `doctl` installed:

```bash
# List your apps
doctl apps list

# Get app ID
APP_ID="YOUR_APP_ID"

# Access console
doctl apps exec $APP_ID --component backend -- npm run babel-node -- node_modules/.bin/sequelize-cli db:seed --seed 20260112000000-demo-staff-data.js
```

### Option C: Create a Migration Script

If console access is difficult, I can create a one-time migration endpoint that you can call via API.

## ✅ Step 4: Verify Deployment

### Check Frontend
1. Visit: https://icebarcatmf-admin-demo-8hsio.ondigitalocean.app
2. Login with: `admin@moneyfactory.com` / `Admin@123!`
3. Navigate to: `/admin/staff`
4. You should see:
   - ✅ Fixed UI (no text overlap)
   - ✅ 11 demo staff members
   - ✅ Proper table layout

### Test the Features
- ✅ Search functionality
- ✅ Filter by role (Manager/Support)
- ✅ Filter by status (Active/Inactive)
- ✅ Sorting columns
- ✅ View, Edit, Delete actions
- ✅ Create new staff

## 📝 Demo User Credentials

All demo staff can login with:
- **Password**: `Demo@123!`

**Managers**:
- sarah.johnson@demo.com
- michael.chen@demo.com
- david.lee@demo.com
- ryan.anderson@demo.com
- alex.thompson@demo.com

**Support**:
- emma.rodriguez@demo.com
- james.wilson@demo.com
- olivia.martinez@demo.com
- sophia.patel@demo.com (inactive)
- isabella.garcia@demo.com
- maya.nguyen@demo.com (inactive)

## 🔍 Troubleshooting

### Deployment not starting?
- Check if GitHub webhook is configured
- Manually trigger deployment from DigitalOcean dashboard

### Build failing?
- Check build logs in DigitalOcean console
- Verify all dependencies are in package.json

### Demo data not showing?
- Seeder wasn't run - follow Step 3
- Database connection issue - check environment variables

### UI still showing overlap?
- Hard refresh: Ctrl+Shift+R (Cmd+Shift+R on Mac)
- Clear browser cache
- CSS may be cached - wait 5 minutes for CDN

## 🎉 Success Checklist

- [ ] Code pushed to GitHub
- [ ] DigitalOcean deployment completed
- [ ] Seeder run successfully
- [ ] Login works on production
- [ ] Staff page loads with demo data
- [ ] UI looks correct (no overlap)
- [ ] All features working

## 📞 Next Steps

Once deployment completes:
1. Run the seeder on production backend
2. Verify the staff page
3. Test all functionality
4. Share the demo link!

**Production URL**: https://icebarcatmf-admin-demo-8hsio.ondigitalocean.app/admin/staff

---

**Deployment initiated**: January 12, 2026  
**Commit hash**: 043c073  
**Files changed**: 5 files (+1118 lines)
