# Staff Management - Quick Reference Guide

## 🔗 Access URL
```
https://icebarcatmf-admin-demo-8hsio.ondigitalocean.app/admin/staff
```

## 🔐 Demo Login Credentials

### All Demo Staff Users
**Password**: `Demo@123!`

### Demo Accounts:

**Managers (5):**
- sarah.johnson@demo.com
- michael.chen@demo.com
- david.lee@demo.com
- ryan.anderson@demo.com
- alex.thompson@demo.com

**Support Staff (6):**
- emma.rodriguez@demo.com
- james.wilson@demo.com
- olivia.martinez@demo.com
- sophia.patel@demo.com (Inactive)
- isabella.garcia@demo.com
- maya.nguyen@demo.com (Inactive)

## ⚡ Quick Actions

| Action | Button | Description |
|--------|--------|-------------|
| **Create** | Green "Create Staff Admin" | Add new staff member |
| **View** | Blue Eye Icon | See staff details |
| **Edit** | Yellow Pencil Icon | Modify staff info |
| **Activate** | Green Check Icon | Set status to active |
| **Deactivate** | Red X Icon | Set status to inactive |
| **Tree** | Gray Tree Icon | View hierarchy |
| **Delete** | Red Trash Icon | Remove staff member |

## 🔍 Search & Filter

### Search Box
- Search by: Email, Name, or Group
- Real-time filtering
- Case-insensitive

### Role Filter
- **All** - Show all roles
- **Admin** - Show only admins
- **Manager** - Show only managers
- **Support** - Show only support staff

### Status Filter
- **All** - Show all statuses
- **Active** - Show only active users
- **In-active** - Show only inactive users

### Reset
- Click the circular arrow icon to clear all filters

## 📊 Sorting

Click on column headers to sort:
- **ID** - Sort by admin user ID
- **Email** - Sort alphabetically by email
- **First Name** - Sort alphabetically by name

Click again to reverse sort order (↑↓)

## 📄 Pagination

- **Items per page**: 10, 25, 50, or 100
- **Navigation**: First, Previous, Page Numbers, Next, Last
- **Total count** displayed at bottom

## 🎯 Common Tasks

### Create a New Staff Member
1. Click "Create Staff Admin" button
2. Fill in required fields:
   - First Name
   - Last Name
   - Email
   - Username
   - Password
   - Role
3. Optional: Add Group, SC/GC Limits
4. Configure Permissions
5. Click "Create"

### Edit Existing Staff
1. Find staff member in list
2. Click yellow pencil icon
3. Modify desired fields
4. Click "Update"

### Change Staff Status
1. Find staff member in list
2. Click green check (to activate) or red X (to deactivate)
3. Confirm in modal
4. Status updates immediately

### Delete Staff Member
1. Find staff member in list
2. Click red trash icon
3. Confirm deletion in modal
4. Staff removed from system

### View Staff Details
1. Click blue eye icon
2. See complete profile
3. View permissions
4. Check activity logs

## 🔑 Permission Levels

### Manager Permissions
Full access to:
- User management
- Transactions
- Bonuses
- Tournaments
- Raffles
- Promotions
- VIP Management
- Reports

### Support Permissions
Read-only access to:
- Users
- Transactions
- Reports
- Alerts
- Email Center
- Notifications

## 🎨 Status Indicators

- 🟢 **Green Badge** = Active
- 🔴 **Red Badge** = Inactive

## 💡 Tips

1. **Protected Admin**: The main admin account cannot be edited or deleted
2. **Managers Only**: Tree view is only available for Manager roles
3. **Coin Limits**: SC/GC limits only apply to Manager roles
4. **Unique Values**: Email and username must be unique
5. **Strong Passwords**: Passwords must meet security requirements
6. **Cascade Delete**: Deleting a staff member also removes their permissions

## 🐛 Troubleshooting

### Can't see staff list?
- Check if you're logged in
- Verify you have "Admins" read permission
- Refresh the page

### Can't create/edit staff?
- Check if you have "Admins" create/update permission
- Verify all required fields are filled
- Check for unique email/username conflicts

### Actions not working?
- Check your permission level
- Some actions are restricted for Admin role
- Ensure backend server is running

## 📞 Support

For issues or questions:
1. Check browser console for errors
2. Verify API endpoints are accessible
3. Check database connection
4. Review permission settings

## 🎉 Success Indicators

✅ **Staff list loads** - Backend connected  
✅ **Search works** - Filtering functional  
✅ **Can create staff** - CRUD operations working  
✅ **Permissions apply** - Security working  
✅ **Status toggles** - Updates functional  

---

**Ready to use!** All 11 demo staff members are in the system and all features are working. 🚀
