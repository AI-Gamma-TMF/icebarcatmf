'use strict'
import db from '../../db/models'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()

    try {
      const getCountryId = await db.Country.findOne({
        where: { code: 'IN' },
        attributes: ['countryId'],
        transaction
      })

      const data = [
        {
          name: 'Madhya Pradesh',
          stateCode: 'MP',
          countryId: getCountryId.countryId,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          name: 'Karnataka',
          stateCode: 'KA',
          countryId: getCountryId.countryId,
          created_at: new Date(),
          updated_at: new Date()
        }
      ]
      await db.State.bulkCreate(data, {
        updateOnDuplicate: ['name'],
        transaction
      })
      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      console.error('Error in seeder user reports:', error)
    }
  },

  down: async (queryInterface, Sequelize) => {
    // try {
    //   await queryInterface.bulkDelete('state', null, {})
    // } catch (error) {
    //   console.log(error)
    // }
  }
}
