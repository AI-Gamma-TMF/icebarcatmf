'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.removeColumn('users', 'referral_code')
    
    await queryInterface.sequelize.query(
      'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";'
    )
    await queryInterface.addColumn('users', 'referral_code', {
      type: Sequelize.UUID,
      allowNull: false,
      defaultValue: Sequelize.fn('uuid_generate_v4')
    })

    await Promise.all([
      queryInterface.addColumn(
        {
          tableName: 'users',
          schema: 'public'
        },
        'referred_by',
        {
          type: Sequelize.BIGINT,
          allowNull: true
        }
      ),
      queryInterface.addColumn(
        {
          tableName: 'user_activities',
          schema: 'public'
        },
        'referred_user',
        {
          type: Sequelize.BIGINT,
          allowNull: true
        }
      )
    ])
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
}
