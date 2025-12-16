'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('withdraw_requests', 'is_approved')
    await queryInterface.removeColumn('withdraw_requests', 'last_run_at')

    await queryInterface.addColumn('withdraw_requests', 'job_id', {
      type: Sequelize.STRING,
      allowNull: true
    })

    await queryInterface.addColumn('withdraw_requests', 'rule_id', {
      type: Sequelize.INTEGER,
      allowNull: true
    })

    await queryInterface.addColumn('withdraw_requests', 'approval_time', {
      type: Sequelize.DATE,
      allowNull: true
    })

    await queryInterface.addColumn('withdraw_requests', 'rule_details', {
      type: Sequelize.JSONB,
      allowNull: true
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('withdraw_requests', 'is_approved', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    })

    await queryInterface.addColumn('withdraw_requests', 'last_run_at', {
      type: Sequelize.DATE,
      allowNull: true
    })

    await queryInterface.removeColumn('withdraw_requests', 'job_id')
    await queryInterface.removeColumn('withdraw_requests', 'rule_id')
    await queryInterface.removeColumn('withdraw_requests', 'approval_time')
    await queryInterface.removeColumn('withdraw_requests', 'rule_details')
  }
}
