'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      console.log('22022675456788: checking wallets.sc_coin column type')
      const [columnInfo] = await queryInterface.sequelize.query(
        `SELECT data_type
         FROM information_schema.columns
         WHERE table_schema = 'public'
           AND table_name = 'wallets'
           AND column_name = 'sc_coin';`,
        { transaction }
      )

      if (!columnInfo.length) {
        console.log('22022675456788: wallets.sc_coin column not found, skipping migration')
        await transaction.commit()
        return
      }

      const dataType = columnInfo[0].data_type
      if (dataType === 'json' || dataType === 'jsonb') {
        console.log('22022675456788: wallets.sc_coin already json/jsonb, skipping conversion')
      } else {
        console.log('22022675456788: start alter column to JSONB')
        // Convert sc_coin column to JSONB while preserving existing values
        await queryInterface.sequelize.query(
          'ALTER TABLE "wallets" ALTER COLUMN "sc_coin" TYPE JSONB USING to_jsonb("sc_coin");',
          { transaction }
        )

        console.log('22022675456788: normalize sc_coin values to object with keys')
        // Ensure every wallet has a JSON object with required keys
        await queryInterface.sequelize.query(
          `UPDATE "wallets"
           SET "sc_coin" = COALESCE("sc_coin", '{"psc":0,"bsc":0,"wsc":0}'::jsonb);`,
          { transaction }
        )
      }

      console.log('22022675456788: inserting MINIMUM_REDEEMABLE_COINS global_setting')
      await queryInterface.bulkInsert('global_settings', [
        {
          key: 'MINIMUM_REDEEMABLE_COINS',
          value: '50',
          created_at: new Date(),
          updated_at: new Date()
        }
      ], { transaction })

      await transaction.commit()
      console.log('22022675456788: completed successfully')
    } catch (error) {
      await transaction.rollback()
      console.error('22022675456788: failed', error)
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
