'use strict'

module.exports = {
  async up (queryInterface, DataTypes) {
    await queryInterface.createTable('bonus', {
      bonus_id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      parent_type: {
        type: DataTypes.STRING,
        allowNull: false
      },
      parent_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      valid_from: {
        type: DataTypes.DATE,
        allowNull: true
      },
      valid_to: {
        type: DataTypes.DATE,
        allowNull: true
      },
      promotion_title: {
        type: DataTypes.JSONB,
        allowNull: true
      },
      bonus_type: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: ''
      },
      term_condition: {
        type: DataTypes.JSONB,
        allowNull: true
      },
      currency: {
        type: DataTypes.JSONB,
        allowNull: false
      },
      image_url: {
        type: DataTypes.STRING,
        allowNull: true
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      },
      wagering_multiplier: {
        type: DataTypes.INTEGER,
        defaultValue: 1
      },
      valid_on_days: {
        type: DataTypes.JSONB,
        allowNull: true
      },
      visible_in_promotions: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      claimed_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      bonus_name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      promo_code: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4
      },
      free_spin_amount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: true
      },
      sc_amount: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      gc_amount: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      is_unique: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      bonus_url: {
        type: DataTypes.STRING,
        allowNull: true
      },
      description: {
        type: DataTypes.JSONB,
        allowNull: false
      },
      other: {
        type: DataTypes.JSONB,
        allowNull: true
      },
      created_at: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updated_at: {
        allowNull: false,
        type: DataTypes.DATE
      },
      deleted_at: {
        allowNull: true,
        type: DataTypes.DATE
      }
    }, {
      schema: 'public'
    })
  },

  async down (queryInterface) {
    await queryInterface.dropTable('bonus', { schema: 'public' })
  }
}
