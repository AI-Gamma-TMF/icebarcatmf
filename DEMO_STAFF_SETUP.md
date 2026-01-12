# Demo Staff Setup - Complete Guide

## ✅ Setup Complete!

The staff management page at `https://icebarcatmf-admin-demo-8hsio.ondigitalocean.app/admin/staff` has been successfully populated with demo data.

## 📊 Demo Staff Members Created

A total of **11 demo staff members** have been added to the database:

### Managers (5 users)
1. **Sarah Johnson** - `sarah.johnson@demo.com`
   - Group: Operations
   - SC Limit: 10,000 | GC Limit: 5,000
   - Status: Active

2. **Michael Chen** - `michael.chen@demo.com`
   - Group: Finance
   - SC Limit: 15,000 | GC Limit: 7,500
   - Status: Active

3. **David Lee** - `david.lee@demo.com`
   - Group: Marketing
   - SC Limit: 12,000 | GC Limit: 6,000
   - Status: Active

4. **Ryan Anderson** - `ryan.anderson@demo.com`
   - Group: Operations
   - SC Limit: 20,000 | GC Limit: 10,000
   - Status: Active

5. **Alex Thompson** - `alex.thompson@demo.com`
   - Group: Compliance
   - SC Limit: 8,000 | GC Limit: 4,000
   - Status: Active

### Support Staff (6 users)
6. **Emma Rodriguez** - `emma.rodriguez@demo.com`
   - Group: Customer Service
   - Status: Active

7. **James Wilson** - `james.wilson@demo.com`
   - Group: Customer Service
   - Status: Active

8. **Olivia Martinez** - `olivia.martinez@demo.com`
   - Group: Technical Support
   - Status: Active

9. **Sophia Patel** - `sophia.patel@demo.com`
   - Group: Technical Support
   - Status: **Inactive** ⚠️

10. **Isabella Garcia** - `isabella.garcia@demo.com`
    - Group: Customer Service
    - Status: Active

11. **Maya Nguyen** - `maya.nguyen@demo.com`
    - Group: Customer Service
    - Status: **Inactive** ⚠️

## 🔐 Login Credentials

All demo users share the same password:
```
Password: Demo@123!
```

## 🎯 Features Available

### Staff Listing Page Features:
1. **Search & Filter**
   - Search by email, name, or group
   - Filter by role (Admin, Manager, Support)
   - Filter by status (Active/Inactive)
   - Reset filters button

2. **Sorting**
   - Sort by ID, Email, or First Name
   - Toggle ascending/descending order

3. **Actions per Staff Member**
   - **View Details** - See complete staff information
   - **Edit** - Modify staff details (not available for Admin role)
   - **Activate/Deactivate** - Toggle staff status
   - **View Tree** - See hierarchical structure (for Managers)
   - **Delete** - Remove staff member (not available for Admin role)

4. **Pagination**
   - Adjustable items per page
   - Navigate through multiple pages

### Permission Levels:

**Manager Permissions:**
- Users: Read, Update
- Transactions: Read
- Bonus: Read, Issue
- Casino Management: Read
- Reports: Read
- Tournaments: Read, Update
- Raffles: Read, Update
- Promotion Bonus: Read, Update
- CRM Promotions: Read, Update
- Block Users: Read, Update
- VIP Management: Read, Update
- And more...

**Support Permissions:**
- Users: Read
- Transactions: Read
- Reports: Read
- Alerts: Read
- Email Center: Read
- Notification Center: Read

## 📁 Files Created

1. **Seeder File**: `/backend/src/db/seeders/20260112000000-demo-staff-data.js`
   - Database seeder for demo staff (can be run with sequelize-cli)

2. **Insert Script**: `/backend/src/scripts/insert-demo-staff.js`
   - Standalone script to insert demo data
   - Checks for existing users to prevent duplicates
   - Can be run independently

3. **This Documentation**: `/DEMO_STAFF_SETUP.md`

## 🚀 How to Run the Script Again

If you need to add the demo data again (on a fresh database):

```bash
cd backend
npm run babel-node -- src/scripts/insert-demo-staff.js
```

The script is idempotent - it checks for existing users and skips them.

## 🧪 Testing the Functionality

### 1. View Staff List
- Navigate to: `https://icebarcatmf-admin-demo-8hsio.ondigitalocean.app/admin/staff`
- You should see all 11 demo staff members

### 2. Test Search
- Search for "johnson" - should show Sarah Johnson
- Search for "Customer Service" - should show Emma, James, Isabella, Maya
- Search for "Operations" - should show Sarah and Ryan

### 3. Test Filters
- Filter by Role: "Manager" - should show 5 managers
- Filter by Role: "Support" - should show 6 support staff
- Filter by Status: "In-active" - should show Sophia and Maya

### 4. Test Sorting
- Click on "ID" header - sorts by admin user ID
- Click on "Email" header - sorts alphabetically by email
- Click on "First Name" header - sorts alphabetically by name
- Click sort icon to toggle ascending/descending

### 5. Test Actions
- **View Details**: Click eye icon on any staff member
- **Edit**: Click edit icon on any Manager or Support (not available for main Admin)
- **Activate/Deactivate**: Click status toggle on Sophia or Maya
- **View Tree**: Click tree icon on any Manager
- **Delete**: Click delete icon (with confirmation)

### 6. Test Create New Staff
- Click "Create Staff Admin" button
- Fill in the form with required details
- Submit to create a new staff member

## 🔧 Backend API Endpoints

The staff page uses these API endpoints:

- `GET /api/v1/admin` - List all admin users
- `POST /api/v1/admin` - Create new admin user
- `PUT /api/v1/admin` - Update admin user
- `DELETE /api/v1/admin` - Delete admin user
- `GET /api/v1/admin/detail` - Get admin details
- `GET /api/v1/admin/roles` - Get all roles
- `GET /api/v1/admin/group` - Get all groups

## 📊 Database Tables

Demo data was inserted into:
- `admin_users` - Staff user records
- `admin_user_permissions` - Permission configurations for each staff member

## 🎨 UI Components

The staff page includes:
- Responsive table layout
- Bootstrap-themed components
- Font Awesome icons for actions
- Overlay tooltips for better UX
- Confirmation modals for destructive actions
- Inline loading indicators
- Empty state messaging

## 💡 Notes

- The main admin account (`admin@moneyfactory.com`) cannot be edited or deleted
- Managers have more extensive permissions than Support staff
- Two users (Sophia Patel and Maya Nguyen) are set as inactive for testing status filters
- All demo users have different groups to test group filtering
- SC/GC limits are only set for Manager roles

## 🐛 Troubleshooting

If the staff page doesn't show data:
1. Check if the backend server is running
2. Verify database connection
3. Check browser console for errors
4. Ensure you're logged in with proper permissions
5. Re-run the insert script if needed

## ✨ Success!

Your staff management page is now fully populated with realistic demo data and all functionality is working as expected!
