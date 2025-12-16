'use strict'

import db from '../../db/models'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await db.GlobalSetting.create(
      {
        key: 'AMOE_BONUS_TIME',
        value: '1',
        created_at: new Date(),
        updated_at: new Date()
      }
    )
  },

  down: async (queryInterface, Sequelize) => {
    await db.GlobalSetting.destroy({
      where: { key: 'AMOE_BONUS_TIME' }
    })
  }
}
