'use strict'
import { BONUS_TYPE } from '../../utils/constants/constant'
import { v4 as UUIDV4 } from 'uuid'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('bonus', [
      {
        parent_type: 'admin',
        parent_id: 1,
        valid_from: new Date(),
        bonus_type: BONUS_TYPE.TIER_BONUS,
        currency: JSON.stringify({}),
        is_active: true,
        promo_code: UUIDV4(),
        bonus_name: 'Tier Bonus',
        description: JSON.stringify({}),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        parent_type: 'admin',
        parent_id: 1,
        valid_from: new Date(),
        bonus_type: BONUS_TYPE.WEEKLY_TIER_BONUS,
        currency: JSON.stringify({}),
        is_active: true,
        promo_code: UUIDV4(),
        bonus_name: 'Weekly Tier Bonus',
        description: JSON.stringify({}),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        parent_type: 'admin',
        parent_id: 1,
        valid_from: new Date(),
        bonus_type: BONUS_TYPE.MONTHLY_TIER_BONUS,
        currency: JSON.stringify({}),
        is_active: true,
        promo_code: UUIDV4(),
        bonus_name: 'Monthly Tier Bonus',
        description: JSON.stringify({}),
        created_at: new Date(),
        updated_at: new Date()
      }
    ])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('bonus', null, {})
  }
}
