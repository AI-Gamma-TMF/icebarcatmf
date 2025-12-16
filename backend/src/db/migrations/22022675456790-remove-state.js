'use strict'

import { Op } from 'sequelize'
import { removeState } from '../../utils/common'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      await removeState(),
      queryInterface.bulkDelete('state',
        {
          state_code: { [Op.in]: ['AR', 'GU', 'PR', 'MP', 'VI', 'UM-79', 'UM-67', 'UM-71', 'UM-86', 'UM-89', 'UM-81', 'UM-84', 'UM-76', 'UM-95', 'UM', 'DC'] }
        }, { cascade: 'true' }
      )
    ])
  }
}
