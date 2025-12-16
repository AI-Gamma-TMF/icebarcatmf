'use strict'
import db from '../models'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await db.GlobalSetting.bulkCreate([
      {
        key: 'ADMIN_NOTIFICATION_GIVEAWAY_ACTIVATION',
        value: 'true'
      },
      {
        key: 'ADMIN_NOTIFICATION_MIN_BET_SLOTS',
        value: '50'
      },
      {
        key: 'ADMIN_NOTIFICATION_MIN_BET_TABLE_GAMES',
        value: '1000'
      },
      {
        key: 'ADMIN_NOTIFICATION_MIN_WIN',
        value: '50'
      },
      {
        key: 'ADMIN_NOTIFICATION_PACKAGE_ACTIVATION',
        value: 'true'
      },
      {
        key: 'ADMIN_NOTIFICATION_TOURNAMENT_ACTIVATION',
        value: 'true'
      }
    ], {
      updateOnDuplicate: ['value']
    })
  },

  down: async (queryInterface, Sequelize) => {
    await db.GlobalSettings.destroy({
      where: {
        key: [
          'ADMIN_NOTIFICATION_GIVEAWAY_ACTIVATION',
          'ADMIN_NOTIFICATION_MIN_BET_SLOTS',
          'ADMIN_NOTIFICATION_MIN_BET_TABLE_GAMES',
          'ADMIN_NOTIFICATION_MIN_WIN',
          'ADMIN_NOTIFICATION_PACKAGE_ACTIVATION',
          'ADMIN_NOTIFICATION_TOURNAMENT_ACTIVATION'
        ]
      }
    })
  }
}
