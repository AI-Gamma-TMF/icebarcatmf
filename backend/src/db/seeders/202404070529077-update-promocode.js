'use strict'

import { PROMOCODE_STATUS } from '../../utils/constants/constant'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()

    try {
      const currentTimestamp = new Date() // Current timestamp

      // Update the expired Promocodes
      await queryInterface.bulkUpdate(
        'promo_codes',
        {
          status: PROMOCODE_STATUS.EXPIRED,
          updated_at: new Date()
        },
        {
          deleted_at: null,
          crm_promocode: false,
          valid_till: {
            [Sequelize.Op.and]: [
              { [Sequelize.Op.ne]: null },
              { [Sequelize.Op.lt]: currentTimestamp }
            ]
          }
        },
        { transaction }
      )
      // Update the archieved Promocodes
      await queryInterface.bulkUpdate(
        'promo_codes',
        {
          status: PROMOCODE_STATUS.DELETED,
          updated_at: new Date()
        },
        {
          crm_promocode: false,
          deleted_at: {
            [Sequelize.Op.ne]: null
          }
        },
        { transaction }
      )
      // Update the active Promocodes status to active
      await queryInterface.bulkUpdate(
        'promo_codes',
        {
          status: PROMOCODE_STATUS.ACTIVE,
          updated_at: new Date()
        },
        {
          deleted_at: null,
          crm_promocode: false,
          valid_till: {
            [Sequelize.Op.and]: [
              { [Sequelize.Op.ne]: null },
              { [Sequelize.Op.gt]: currentTimestamp }
            ]
          }
        },
        { transaction }
      )

      // Update the active Promocodes without validity to EXPIRED
      await queryInterface.bulkUpdate(
        'promo_codes',
        {
          status: PROMOCODE_STATUS.EXPIRED,
          updated_at: new Date()
        },
        {
          deleted_at: null,
          crm_promocode: false,
          valid_till: null
        },
        { transaction }
      )

      // Updating CRM Promocodes in Promo code Model
      await queryInterface.bulkUpdate(
        'promo_codes',
        {
          status: PROMOCODE_STATUS.UPCOMING,
          updated_at: new Date()
        },
        {
          deleted_at: null,
          crm_promocode: true,
          valid_till: null,
          valid_from: null
        },
        { transaction }
      )

      await queryInterface.bulkUpdate(
        'promo_codes',
        {
          status: PROMOCODE_STATUS.ACTIVE,
          updated_at: new Date()
        },
        {
          deleted_at: null,
          crm_promocode: true,
          valid_from: {
            [Sequelize.Op.and]: [
              { [Sequelize.Op.ne]: null },
              { [Sequelize.Op.lt]: currentTimestamp }
            ]
          },
          valid_till: {
            [Sequelize.Op.and]: [
              { [Sequelize.Op.ne]: null },
              { [Sequelize.Op.gt]: currentTimestamp }
            ]
          }
        },
        { transaction }
      )

      await queryInterface.bulkUpdate(
        'promo_codes',
        {
          status: PROMOCODE_STATUS.DELETED,
          updated_at: new Date()
        },
        {
          crm_promocode: true,
          deleted_at: {
            [Sequelize.Op.ne]: null
          }
        },
        { transaction }
      )

      await queryInterface.bulkUpdate(
        'promo_codes',
        {
          status: PROMOCODE_STATUS.EXPIRED,
          updated_at: new Date()
        },
        {
          deleted_at: null,
          crm_promocode: true,
          valid_till: {
            [Sequelize.Op.or]: [
              { [Sequelize.Op.is]: null },
              { [Sequelize.Op.lt]: currentTimestamp }
            ]
          }
        },
        { transaction }
      )

      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Optional: Add logic to undo the update if needed
  }
}
