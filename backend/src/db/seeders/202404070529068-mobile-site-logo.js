'use strict'
import db from '../../db/models'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await db.GlobalSetting.create({
      key: 'MOBILE_SITE_LOGO_URL',
      value: 'https://www.themoneyfactory.com/assets/brand-logo-mob.e0030edf.webp',
      created_at: new Date(),
      updated_at: new Date()
    })
  },

  down: async (queryInterface, Sequelize) => {
    await db.GlobalSetting.destroy({
      where: { key: 'AMOE_BONUS_TIME' }
    })
  }
}
