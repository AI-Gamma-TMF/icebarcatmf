'use strict'
import { updateSuperAdminPermissions } from '../../utils/common'
import { BONUS_TYPE } from '../../utils/constants/constant'
import { v4 as UUIDV4 } from 'uuid'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('bonus', [
      {
        parent_type: 'admin',
        parent_id: 1,
        valid_from: new Date(),
        // valid_to: new Date(),
        bonus_type: BONUS_TYPE.POSTAL_CODE_BONUS,
        currency: JSON.stringify({}),
        is_active: false,
        promo_code: UUIDV4(),
        bonus_name: 'Postal Code Bonus',
        description: JSON.stringify({}),
        created_at: new Date(),
        updated_at: new Date()
      }
    ])
    await updateSuperAdminPermissions()
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('bonus', null, {})
  }
}
