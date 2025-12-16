'use strict'

module.exports = {
  async up (queryInterface, DataTypes) {
    await Promise.allSettled([
      queryInterface.addColumn('postal_codes', 'ip_address', { type: DataTypes.STRING, allowNull: true }),
      queryInterface.removeColumn('postal_codes', 'is_claimed', { schema: 'public' }),
      queryInterface.sequelize.query("ALTER TYPE \"public\".\"enum_bonus_bonus_type\" ADD VALUE 'postal-code-bonus';"),
      queryInterface.sequelize.query("ALTER TYPE \"public\".\"enum_user_bonus_bonus_type\" ADD VALUE 'postal-code-bonus';"),
      queryInterface.sequelize.query("ALTER TYPE \"public\".\"enum_user_activities_activity_type\" ADD VALUE 'postal-code-bonus-claimed';")
    ])
  },

  async down (queryInterface, DataTypes) {
    await queryInterface.dropTable('postal_codes', { schema: 'public' })
  }

}
