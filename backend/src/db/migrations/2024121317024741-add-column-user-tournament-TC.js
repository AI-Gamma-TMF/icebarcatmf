module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'is_sc_tournament_terms_accepted', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    })

    await queryInterface.addColumn('users', 'is_gc_tournament_terms_accepted', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'is_sc_tournament_terms_accepted')
    await queryInterface.removeColumn('users', 'is_gc_tournament_terms_accepted')
  }
}
