'use strict'

module.exports = {
  async up (queryInterface, DataTypes) {
    // Create demo admin users with different roles
    const adminUsers = [
      {
        first_name: 'Sarah',
        last_name: 'Johnson',
        email: 'sarah.johnson@demo.com',
        password: '$2b$10$KCuZXsk7bTTsgY8H9anRxu/ly.45YfFHXeDKQB02H0ceNUsT2Pe9m', // Demo@123!
        role_id: 2, // Manager
        parent_type: 'AdminUser',
        parent_id: 1, // Parent is the main admin
        is_active: true,
        admin_username: 'sarahj',
        group: 'Operations',
        sc_limit: 10000,
        gc_limit: 5000,
        created_at: new Date('2024-01-15'),
        updated_at: new Date('2024-01-15')
      },
      {
        first_name: 'Michael',
        last_name: 'Chen',
        email: 'michael.chen@demo.com',
        password: '$2b$10$KCuZXsk7bTTsgY8H9anRxu/ly.45YfFHXeDKQB02H0ceNUsT2Pe9m', // Demo@123!
        role_id: 2, // Manager
        parent_type: 'AdminUser',
        parent_id: 1,
        is_active: true,
        admin_username: 'michaelc',
        group: 'Finance',
        sc_limit: 15000,
        gc_limit: 7500,
        created_at: new Date('2024-02-20'),
        updated_at: new Date('2024-02-20')
      },
      {
        first_name: 'Emma',
        last_name: 'Rodriguez',
        email: 'emma.rodriguez@demo.com',
        password: '$2b$10$KCuZXsk7bTTsgY8H9anRxu/ly.45YfFHXeDKQB02H0ceNUsT2Pe9m', // Demo@123!
        role_id: 3, // Support
        parent_type: 'AdminUser',
        parent_id: 1,
        is_active: true,
        admin_username: 'emmar',
        group: 'Customer Service',
        created_at: new Date('2024-03-10'),
        updated_at: new Date('2024-03-10')
      },
      {
        first_name: 'James',
        last_name: 'Wilson',
        email: 'james.wilson@demo.com',
        password: '$2b$10$KCuZXsk7bTTsgY8H9anRxu/ly.45YfFHXeDKQB02H0ceNUsT2Pe9m', // Demo@123!
        role_id: 3, // Support
        parent_type: 'AdminUser',
        parent_id: 1,
        is_active: true,
        admin_username: 'jamesw',
        group: 'Customer Service',
        created_at: new Date('2024-04-05'),
        updated_at: new Date('2024-04-05')
      },
      {
        first_name: 'Olivia',
        last_name: 'Martinez',
        email: 'olivia.martinez@demo.com',
        password: '$2b$10$KCuZXsk7bTTsgY8H9anRxu/ly.45YfFHXeDKQB02H0ceNUsT2Pe9m', // Demo@123!
        role_id: 3, // Support
        parent_type: 'AdminUser',
        parent_id: 1,
        is_active: true,
        admin_username: 'oliviam',
        group: 'Technical Support',
        created_at: new Date('2024-05-12'),
        updated_at: new Date('2024-05-12')
      },
      {
        first_name: 'David',
        last_name: 'Lee',
        email: 'david.lee@demo.com',
        password: '$2b$10$KCuZXsk7bTTsgY8H9anRxu/ly.45YfFHXeDKQB02H0ceNUsT2Pe9m', // Demo@123!
        role_id: 2, // Manager
        parent_type: 'AdminUser',
        parent_id: 1,
        is_active: true,
        admin_username: 'davidl',
        group: 'Marketing',
        sc_limit: 12000,
        gc_limit: 6000,
        created_at: new Date('2024-06-18'),
        updated_at: new Date('2024-06-18')
      },
      {
        first_name: 'Sophia',
        last_name: 'Patel',
        email: 'sophia.patel@demo.com',
        password: '$2b$10$KCuZXsk7bTTsgY8H9anRxu/ly.45YfFHXeDKQB02H0ceNUsT2Pe9m', // Demo@123!
        role_id: 3, // Support
        parent_type: 'AdminUser',
        parent_id: 1,
        is_active: false, // Inactive user
        admin_username: 'sophiap',
        group: 'Technical Support',
        created_at: new Date('2024-07-22'),
        updated_at: new Date('2025-12-01')
      },
      {
        first_name: 'Ryan',
        last_name: 'Anderson',
        email: 'ryan.anderson@demo.com',
        password: '$2b$10$KCuZXsk7bTTsgY8H9anRxu/ly.45YfFHXeDKQB02H0ceNUsT2Pe9m', // Demo@123!
        role_id: 2, // Manager
        parent_type: 'AdminUser',
        parent_id: 1,
        is_active: true,
        admin_username: 'ryana',
        group: 'Operations',
        sc_limit: 20000,
        gc_limit: 10000,
        created_at: new Date('2024-08-30'),
        updated_at: new Date('2024-08-30')
      },
      {
        first_name: 'Isabella',
        last_name: 'Garcia',
        email: 'isabella.garcia@demo.com',
        password: '$2b$10$KCuZXsk7bTTsgY8H9anRxu/ly.45YfFHXeDKQB02H0ceNUsT2Pe9m', // Demo@123!
        role_id: 3, // Support
        parent_type: 'AdminUser',
        parent_id: 1,
        is_active: true,
        admin_username: 'isabellag',
        group: 'Customer Service',
        created_at: new Date('2024-09-14'),
        updated_at: new Date('2024-09-14')
      },
      {
        first_name: 'Alex',
        last_name: 'Thompson',
        email: 'alex.thompson@demo.com',
        password: '$2b$10$KCuZXsk7bTTsgY8H9anRxu/ly.45YfFHXeDKQB02H0ceNUsT2Pe9m', // Demo@123!
        role_id: 2, // Manager
        parent_type: 'AdminUser',
        parent_id: 1,
        is_active: true,
        admin_username: 'alext',
        group: 'Compliance',
        sc_limit: 8000,
        gc_limit: 4000,
        created_at: new Date('2024-10-25'),
        updated_at: new Date('2024-10-25')
      },
      {
        first_name: 'Maya',
        last_name: 'Nguyen',
        email: 'maya.nguyen@demo.com',
        password: '$2b$10$KCuZXsk7bTTsgY8H9anRxu/ly.45YfFHXeDKQB02H0ceNUsT2Pe9m', // Demo@123!
        role_id: 3, // Support
        parent_type: 'AdminUser',
        parent_id: 1,
        is_active: false, // Inactive user
        admin_username: 'mayan',
        group: 'Customer Service',
        created_at: new Date('2024-11-08'),
        updated_at: new Date('2025-11-20')
      }
    ]

    // Insert admin users
    await queryInterface.bulkInsert('admin_users', adminUsers)

    // Get the inserted admin user IDs
    const insertedUsers = await queryInterface.sequelize.query(
      `SELECT admin_user_id, email FROM admin_users WHERE email IN (${adminUsers.map(u => `'${u.email}'`).join(', ')})`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    // Create permissions for each user
    const permissions = insertedUsers.map(user => {
      const isManager = adminUsers.find(u => u.email === user.email).role_id === 2
      
      return {
        admin_user_id: user.admin_user_id,
        permission: JSON.stringify(isManager ? {
          // Manager permissions - more extensive
          Users: ['R', 'U'],
          Transactions: ['R'],
          Bonus: ['R', 'Issue'],
          CasinoManagement: ['R'],
          Report: ['R'],
          Tournaments: ['R', 'U'],
          Tiers: ['R'],
          Raffles: ['R', 'U'],
          RafflePayout: ['R'],
          PromotionBonus: ['R', 'U'],
          WalletCoin: ['R'],
          Promocode: ['R'],
          CrmPromotion: ['R', 'U'],
          ExportCenter: ['R'],
          BlockUsers: ['R', 'U'],
          emailCenter: ['R'],
          Amoe: ['R'],
          NotificationCenter: ['R'],
          AdminAddedCoins: ['R'],
          VipManagement: ['R', 'U'],
          CashierManagement: ['R'],
          Alert: ['R']
        } : {
          // Support permissions - limited
          Users: ['R'],
          Transactions: ['R'],
          Report: ['R'],
          Alert: ['R'],
          emailCenter: ['R'],
          NotificationCenter: ['R']
        }),
        created_at: new Date(),
        updated_at: new Date()
      }
    })

    await queryInterface.bulkInsert('admin_user_permissions', permissions)
  },

  async down (queryInterface, DataTypes) {
    const { Sequelize } = require('sequelize')
    
    // Get admin user IDs for demo users
    const demoUsers = await queryInterface.sequelize.query(
      `SELECT admin_user_id FROM admin_users WHERE email IN ('sarah.johnson@demo.com', 'michael.chen@demo.com', 'emma.rodriguez@demo.com', 'james.wilson@demo.com', 'olivia.martinez@demo.com', 'david.lee@demo.com', 'sophia.patel@demo.com', 'ryan.anderson@demo.com', 'isabella.garcia@demo.com', 'alex.thompson@demo.com', 'maya.nguyen@demo.com')`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    
    const demoUserIds = demoUsers.map(u => u.admin_user_id)
    
    // Delete permissions first
    if (demoUserIds.length > 0) {
      await queryInterface.bulkDelete('admin_user_permissions', {
        admin_user_id: {
          [Sequelize.Op.in]: demoUserIds
        }
      })
      
      // Then delete demo users
      await queryInterface.bulkDelete('admin_users', {
        email: {
          [Sequelize.Op.in]: [
            'sarah.johnson@demo.com',
            'michael.chen@demo.com',
            'emma.rodriguez@demo.com',
            'james.wilson@demo.com',
            'olivia.martinez@demo.com',
            'david.lee@demo.com',
            'sophia.patel@demo.com',
            'ryan.anderson@demo.com',
            'isabella.garcia@demo.com',
            'alex.thompson@demo.com',
            'maya.nguyen@demo.com'
          ]
        }
      })
    }
  }
}
