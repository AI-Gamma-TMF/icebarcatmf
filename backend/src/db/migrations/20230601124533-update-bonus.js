'use strict'

const { BONUS_TYPE } = require('../../utils/constants/constant')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn({
      tableName: 'bonus',
      schema: 'public'
    }, 'bonus_type',
    {
      type: Sequelize.STRING,
      allowNull: false
    }
    )
    await queryInterface.addColumn({
      tableName: 'bonus',
      schema: 'public'
    }, 'bonus_type',
    {
      type: Sequelize.ENUM(Object.values(BONUS_TYPE)),
      allowNull: false,
      defaultValue: Sequelize.literal(`'${BONUS_TYPE.WELCOME_BONUS}'`)
    }
    )
    await queryInterface.addColumn({
      tableName: 'bonus',
      schema: 'public'
    }, 'bonus_parent_id',
    {
      type: Sequelize.INTEGER,
      allowNull: true
    }
    )
    await queryInterface.addColumn({
      tableName: 'bonus',
      schema: 'public'
    }, 'day',
    {
      type: Sequelize.INTEGER,
      allowNull: true
    }
    )
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
}
