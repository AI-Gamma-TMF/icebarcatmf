'use strict'

module.exports = {
  async up (queryInterface, DataTypes) {
    await queryInterface.addColumn(
      {
        tableName: 'responsible_gambling',
        schema: 'public'
      },
      'is_removed',
      {
        type: DataTypes.BOOLEAN,
        allowNull: true
      }
    )
  },

  async down (queryInterface, DataTypes) {
    await queryInterface.removeColumn(
      {
        tableName: 'responsible_gambling',
        schema: 'public'
      },
      'is_removed'
    )
  }
}
