'use strict'

module.exports = {
  async up (queryInterface, DataTypes) {
    await queryInterface.createTable('wagering_templates', {
      wagering_template_id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      parent_type: {
        type: DataTypes.STRING,
        allowNull: true
      },
      parent_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      game_contribution: {
        type: DataTypes.JSONB
      },
      created_at: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updated_at: {
        allowNull: false,
        type: DataTypes.DATE
      }
    }, { schema: 'public' })
  },

  async down (queryInterface, DataTypes) {
    await queryInterface.dropTable('wagering_templates', { schema: 'public' })
  }
}
