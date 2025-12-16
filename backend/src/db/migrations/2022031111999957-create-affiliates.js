'use strict'

module.exports = {
  async up (queryInterface, DataTypes) {
    await queryInterface.createTable('affiliates', {
      affiliate_id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      tracking_token: {
        type: DataTypes.STRING,
        allowNull: true
      },
      user_id_affiliate: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      user_hash_id: {
        type: DataTypes.STRING,
        allowNull: true
      },
      parent_id_affiliate: {
        type: DataTypes.STRING,
        allowNull: true
      },
      parent_username: {
        type: DataTypes.STRING,
        allowNull: true
      },
      admin_id_affiliate: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      admin_username: {
        type: DataTypes.STRING,
        allowNull: true
      },
      username: {
        type: DataTypes.STRING,
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
        allowNull: true
      },
      balance: {
        type: DataTypes.FLOAT,
        allowNull: true
      },
      payment_type: {
        type: DataTypes.FLOAT,
        allowNull: true
      },
      minimum_payment: {
        type: DataTypes.FLOAT,
        allowNull: true
      },
      company: {
        type: DataTypes.STRING,
        allowNull: true
      },
      dob: {
        type: DataTypes.STRING,
        allowNull: true
      },
      marketing: {
        type: DataTypes.STRING,
        allowNull: true
      },
      mobile: {
        type: DataTypes.STRING,
        allowNull: true
      },
      skype: {
        type: DataTypes.STRING,
        allowNull: true
      },
      terms_agreement: {
        type: DataTypes.STRING,
        allowNull: true
      },
      website: {
        type: DataTypes.STRING,
        allowNull: true
      },
      country: {
        type: DataTypes.STRING,
        allowNull: true
      },
      currency: {
        type: DataTypes.STRING,
        allowNull: true
      },
      status: {
        type: DataTypes.STRING,
        allowNull: true
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true
      },
      other_details: {
        type: DataTypes.JSONB,
        allowNull: true
      },
      join_date: {
        type: DataTypes.DATE,
        allowNull: true
      },
      created_at: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updated_at: {
        allowNull: false,
        type: DataTypes.DATE
      }
    }, {
      schema: 'public'
    })
  },

  async down (queryInterface, DataTypes) {
    await queryInterface.dropTable('affiliates', { schema: 'public' })
  }
}
