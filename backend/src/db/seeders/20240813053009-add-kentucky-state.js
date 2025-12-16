'use strict'

import db from '../../db/models'

module.exports = {
    up: async (queryInterface, Sequelize) => {
			const isStateExist = await db.State.findOne({
				where: { stateCode: 'KY' }
			})
			
			const country = await db.Country.findOne({
				where: { code: 'US' }
			})

			if (!isStateExist) {
				await db.State.create({
					name: 'Kentucky',
					stateCode: 'KY',
					countryId: country.countryId
				})
			}
    },
  
    down: async (queryInterface, Sequelize) => {
			await db.State.destroy({
				where: { stateCode: 'KY' }
			})
    }
}