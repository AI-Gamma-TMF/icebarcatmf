'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn({
        tableName: 'responsible_gambling',
        schema: 'public'
      }, 'last_active_time',
      {
        type: Sequelize.DATE,
        allowNull: true
      }
      ),
      queryInterface.addColumn({
        tableName: 'responsible_gambling',
        schema: 'public'
      }, 'total_time',
      {
        type: Sequelize.INTEGER,
        allowNull: true
      }
      )
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn({ tableName: 'responsible_gambling', schema: 'public' },
        'last_active_time', Sequelize.STRING),
      queryInterface.removeColumn({ tableName: 'responsible_gambling', schema: 'public' },
        'total_time', Sequelize.INTEGER),
      queryInterface.changeColumn({ tableName: 'activity_logs', schema: 'public' },
        'actionee_id', Sequelize.STRING)
    ])
  }
}
