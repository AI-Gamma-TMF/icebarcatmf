'use strict'
import db from '../models'
import rubyPlayGames from '../../scripts/rubyPlay-game-list.json'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await await queryInterface.sequelize.transaction()

    try {
      let aggregatorId, providerId

      // 1. find aggregator
      const isAggregatorExist = await db.MasterGameAggregator.findOne({
        attributes: ['masterGameAggregatorId', 'name'],
        where: { name: 'rubyplay' },
        transaction,
        raw: true
      })

      if (!isAggregatorExist) {
        const createAggregator = await db.MasterGameAggregator.create({
          name: 'rubyplay'
        },
        { transaction })

        aggregatorId = createAggregator.masterGameAggregatorId
      } else {
        aggregatorId = isAggregatorExist?.masterGameAggregatorId
      }

      // 2. find provider

      const findProvider = await db.MasterCasinoProvider.findOne({
        attributes: ['masterCasinoProviderId', 'name'],
        where: {
          masterGameAggregatorId: aggregatorId,
          name: 'RUBYPLAY'
        },
        transaction,
        raw: true
      })

      if (!findProvider) {
        const newProvider = await db.MasterCasinoProvider.create(
          {
            name: 'RUBYPLAY',
            isActive: true,
            masterGameAggregatorId: aggregatorId
          },
          { transaction }
        )
        providerId = newProvider.masterCasinoProviderId
      } else {
        providerId = findProvider?.masterCasinoProviderId
      }

      // 3. add games:
      await Promise.all(
        rubyPlayGames.map(async (game) => {
          if (game?.Active === 'TRUE') {
            const isGameExist = await db.MasterCasinoGame.findOne({
              where: {
                identifier: game['Game ID'],
                masterCasinoProviderId: providerId
              },
              transaction
            })

            if (!isGameExist) {
              await db.MasterCasinoGame.create({
                name: game['Game Name'],
                identifier: game['Game ID'],
                masterCasinoProviderId: providerId,
                hasFreespins: false,
                isDemoSupported: false,
                returnToPlayer: +game.RTP.replace('%', '') || null

              },
              { transaction }
              )
            } else if (+isGameExist.returnToPlayer !== +game.RTP.replace('%', '') || isGameExist.name !== game['Game Name']) {
              if (+isGameExist.returnToPlayer !== +game.RTP.replace('%', '')) isGameExist.returnToPlayer = +game.RTP.replace('%', '')
              if (isGameExist.name !== game['Game Name']) isGameExist.name = game['Game Name']
              await isGameExist.save({ transaction })
            }
          }
        })
      )
      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      console.log('Error occur in seeding the game', error)
    }
  },

  down: async (queryInterface, Sequelize) => {

  }
}
