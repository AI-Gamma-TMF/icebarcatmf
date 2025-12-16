'use strict'
import { BONUS_TYPE } from '../../utils/constants/constant'
import { v4 as UUIDV4 } from 'uuid'
import db from '../../db/models'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await db.Bonus.create(
      {
        parentType: 'admin',
        parentId: 1,
        validFrom: new Date(),
        bonusType: BONUS_TYPE.PROVIDER_BONUS,
        currency: JSON.stringify({}),
        isActive: true,
        promoCode: UUIDV4(),
        bonusName: 'Provider Bonus',
        description: JSON.stringify({}),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    )
  },

  down: async (queryInterface, Sequelize) => {
    await db.Bonus.destroy({
      where: { bonusType: BONUS_TYPE.PROVIDER_BONUS }
    })
  }
}
