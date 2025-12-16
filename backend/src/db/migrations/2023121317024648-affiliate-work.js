'use strict'

module.exports = {
  up: async (queryInterface, DataTypes) => {
    try {
      await queryInterface.dropTable('affiliates')
    } catch (e) {
      console.log('Table "affiliate" does not exist, skipping drop.')
    }

    await queryInterface.createTable(
      'affiliates',
      {
        affiliate_id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true
        },
        affiliate_code: {
          type: DataTypes.UUID,
          allowNull: true
        },
        first_name: {
          type: DataTypes.STRING,
          allowNull: true
        },
        last_name: {
          type: DataTypes.STRING,
          allowNull: true
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false
        },
        password: {
          type: DataTypes.STRING,
          allowNull: true
        },
        is_active: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
          defaultValue: true
        },
        phone_code: {
          type: DataTypes.STRING,
          allowNull: true
        },
        phone: {
          type: DataTypes.STRING,
          allowNull: true
        },
        affiliate_status: {
          type: DataTypes.STRING,
          defaultValue: 'pending'
        },
        traffic_source: {
          type: DataTypes.TEXT,
          allowNull: true
        },
        plan: {
          type: DataTypes.TEXT,
          allowNull: true
        },
        is_terms_accepted: {
          type: DataTypes.BOOLEAN,
          defaultValue: false
        },
        preferred_contact: {
          type: DataTypes.STRING,
          defaultValue: true
        },
        is_email_verified: {
          type: DataTypes.BOOLEAN,
          defaultValue: false
        },
        is_phone_verified: {
          type: DataTypes.BOOLEAN,
          defaultValue: false
        },
        email_token: {
          type: DataTypes.STRING
        },
        role_id: {
          type: DataTypes.INTEGER
        },
        new_password_key: {
          type: DataTypes.STRING
        },
        new_password_requested: {
          type: DataTypes.DATE
        },
        created_at: {
          allowNull: false,
          type: DataTypes.DATE
        },
        updated_at: {
          allowNull: false,
          type: DataTypes.DATE
        },
        date_of_birth: {
          type: DataTypes.STRING,
          allowNull: true
        },
        gender: {
          type: DataTypes.STRING,
          allowNull: true
        },
        address_line_1: {
          type: DataTypes.STRING,
          allowNull: true
        },
        address_line_2: {
          type: DataTypes.STRING,
          allowNull: true
        },
        city: {
          type: DataTypes.STRING,
          allowNull: true
        },
        state: {
          type: DataTypes.STRING,
          allowNull: true
        },
        country: {
          type: DataTypes.STRING,
          allowNull: true
        },
        zip_code: {
          type: DataTypes.STRING,
          allowNull: true
        },
        permission: {
          type: DataTypes.JSONB,
          allowNull: true
        },
        profile_image: {
          type: DataTypes.STRING,
          allowNull: true
        }
      },
      {
        schema: 'public'
      }
    )

    await queryInterface.addColumn('users', 'affiliate_code', {
      type: DataTypes.UUID,
      allowNull: true
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('affiliates', { schema: 'public' })
    await queryInterface.removeColumn('users', 'affiliate_code')
  }
}
