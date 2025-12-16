'use strict'

module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.addColumn('free_spin_bonus_grant', 'days_validity', {
      type: DataTypes.INTEGER,
      allowNull: true
    })

    await queryInterface.changeColumn('free_spin_bonus_grant', 'start_date', {
      type: DataTypes.DATE,
      allowNull: true
    })

    await queryInterface.changeColumn('free_spin_bonus_grant', 'end_date', {
      type: DataTypes.DATE,
      allowNull: true
    })

    await queryInterface.addColumn('package', 'free_spin_id', {
      type: DataTypes.INTEGER,
      allowNull: true
    })

    await queryInterface.addColumn('bonus', 'free_spin_id', {
      type: DataTypes.INTEGER,
      allowNull: true
    })
  },

  down: async (queryInterface, DataTypes) => {
    await queryInterface.removeColumn('free_spin_bonus_grant', 'days_validity')

    await queryInterface.changeColumn('free_spin_bonus_grant', 'start_date', {
      type: DataTypes.DATE,
      allowNull: false
    })

    await queryInterface.changeColumn('free_spin_bonus_grant', 'end_date', {
      type: DataTypes.DATE,
      allowNull: false
    })

    await queryInterface.removeColumn('package', 'free_spin_id')
    await queryInterface.removeColumn('bonus', 'free_spin_id')
  }
}
