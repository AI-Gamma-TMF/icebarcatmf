'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      // Convert sc_coin column to JSONB while preserving existing values
      await queryInterface.sequelize.query(
        'ALTER TABLE "wallets" ALTER COLUMN "sc_coin" TYPE JSONB USING to_jsonb("sc_coin");',
        { transaction }
      )

      // Ensure every wallet has a JSON object with required keys
      await queryInterface.sequelize.query(
        `UPDATE "wallets"
         SET "sc_coin" = COALESCE("sc_coin", '{"psc":0,"bsc":0,"wsc":0}'::jsonb);`,
        { transaction }
      )

      await queryInterface.bulkInsert('global_settings', [
        {
          key: 'MINIMUM_REDEEMABLE_COINS',
          value: '50',
          created_at: new Date(),
          updated_at: new Date()
        }
      ], { transaction })

      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.removeColumn({
        tableName: 'wallets',
        schema: 'public'
      }, 'sc_coin', { transaction })
      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }
}
