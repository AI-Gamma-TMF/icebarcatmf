import axios from 'axios'
import config from '../../configs/app.config'
import ServiceBase from '../../libs/serviceBase'

export default class AleaGetGamesService extends ServiceBase {
  async run () {
    const {
      dbModels: {
        GameSubCategory: GameSubCategoryModel,
        MasterCasinoGame: MasterCasinoGameModel,
        MasterGameAggregator: MasterGameAggregatorModel,
        MasterCasinoProvider: MasterCasinoProviderModel,
        MasterGameSubCategory: MasterGameSubCategoryModel
      },
      sequelizeTransaction: transaction
    } = this.context

    const { page, size } = this.args

    const env = config.get('env') !== 'production' ? 'gamesAvailable' : 'gamesReady'
    const query = JSON.stringify({
      query: `{
      ${env}(jurisdictionCode: "CAO", size: ${size}, page: ${page}) {
        page {
          number
          size
          totalPages
          totalElements
        }
        results {
          id
          name
          software {
              id
              name
          }
          type
          status
          genre
          jackpot
          freeSpinsCurrencies
          ratio
          rtp
          volatility
          minBet
          maxBet
          maxExposure
          maxWinMultiplier
          lines
          hitFrequency
          buyFeature
          releaseDate
          features
          assetsLink
          thumbnailLinks
          demoAvailable
        }
      }
    }`,
      variables: {}
    })

    const options = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://customer-api.aleaplay.com/api/graphql',
      headers: {
        Authorization: `Bearer ${config.get('alea.secret_token')}`,
        'Alea-CasinoId': config.get('alea.casino_id'),
        'Content-Type': 'application/json'
      },
      data: query
    }

    try {
      const {
        data: { data: object },
        status
      } = await axios(options)

      const { page: pageDetails, results: data } =
        env === 'gamesAvailable'
          ? object.gamesAvailable
          : object.gamesReady

      if (status !== 200) return this.addError('ThirdPartyApiErrorType')

      let aggregatorId, categoryId
      const isAggregatorExist = await MasterGameAggregatorModel.findOne({
        where: { name: 'alea' },
        transaction
      })

      if (!isAggregatorExist) {
        const createAggregator = await MasterGameAggregatorModel.create(
          {
            name: 'alea',
            isActive: true
          },
          { transaction }
        )
        aggregatorId = createAggregator.masterGameAggregatorId
      } else {
        aggregatorId = isAggregatorExist?.masterGameAggregatorId
      }

      let gameSubCategories = []
      let gameProviders = []

      await Promise.all(
        data.map(game => {
          if (!gameSubCategories.includes(game.genre)) {
            gameSubCategories.push(game.genre)
          }
          if (!gameProviders.includes(game.software.name.toUpperCase())) {
            gameProviders.push(game.software.name.toUpperCase())
          }
          return true
        })
      )

      gameSubCategories = Array.from(new Set(gameSubCategories))
      gameProviders = Array.from(new Set(gameProviders))

      const bulkSubCategories = []

      await Promise.all(
        gameSubCategories.map(async subCategory => {
          const categoryExist = await MasterGameSubCategoryModel.findOne({
            where: {
              'name.EN': subCategory
            },
            transaction
          })
          if (!categoryExist) {
            bulkSubCategories.push({
              name: { EN: subCategory },
              masterGameCategoryId: +categoryId,
              isActive: false,
              isFeatured: false
            })
          }
        })
      )

      if (bulkSubCategories.length > 0) {
        await MasterGameSubCategoryModel.bulkCreate(bulkSubCategories, {
          transaction,
          raw: true
        })
      }

      await Promise.all(
        gameProviders.map(async provider => {
          const findProvider = await MasterCasinoProviderModel.findOne({
            attributes: ['masterCasinoProviderId', 'name'],
            where: {
              masterGameAggregatorId: aggregatorId,
              name: provider
            },
            raw: true,
            transaction
          })
          if (!findProvider) {
            await MasterCasinoProviderModel.create(
              {
                name: provider,
                isActive: true,
                masterGameAggregatorId: aggregatorId
              },
              { transaction }
            )
          }
        })
      )

      await Promise.all(
        data.map(async game => {
          if (!(game?.status && game.status === 'ONLINE')) {
            return
          }
          let providerId, subCategoryId, gameId
          const findProvider = await MasterCasinoProviderModel.findOne({
            attributes: ['masterCasinoProviderId', 'name'],
            where: {
              masterGameAggregatorId: aggregatorId,
              name: game.software.name.toUpperCase()
            },
            raw: true,
            transaction
          })
          if (!findProvider) {
            const newProvider = await MasterCasinoProviderModel.create(
              {
                name: game.software.name.toUpperCase(),
                isActive: true,
                masterGameAggregatorId: aggregatorId
              },
              { transaction }
            )
            providerId = newProvider.masterCasinoProviderId
          } else {
            providerId = findProvider.masterCasinoProviderId
          }

          const findCategory = await MasterGameSubCategoryModel.findOne({
            where: {
              'name.EN': game.genre + ''
            },
            transaction
          })

          if (!findCategory) {
            const newCategory = await MasterGameSubCategoryModel.create(
              {
                'name.EN': game.genre + '',
                masterGameCategoryId: +categoryId,
                isActive: true,
                isFeatured: true
              },
              { transaction }
            )
            subCategoryId = newCategory.masterGameSubCategoryId
          } else {
            subCategoryId = findCategory.masterGameSubCategoryId
          }

          const isGameExist = await MasterCasinoGameModel.findOne({
            where: {
              identifier: game.id + '',
              masterCasinoProviderId: providerId
            },
            transaction
          })

          if (!isGameExist) {
            const newGame = await MasterCasinoGameModel.create(
              {
                name: game.name,
                identifier: +game.id,
                masterCasinoProviderId: providerId,
                isDemoSupported: game.demoAvailable
                  ? game.demoAvailable
                  : false,
                hasFreeSpins: game.supportFrb === 'Yes',
                returnToPlayer: game.rtp
              },
              { transaction }
            )
            gameId = newGame.masterCasinoGameId
          } else if (isGameExist.returnToPlayer !== game.rtp) {
            gameId = isGameExist.masterCasinoGameId
            await isGameExist.set({ returnToPlayer: game.rtp }).save()
          } else {
            gameId = isGameExist.masterCasinoGameId
          }

          const isMapped = await GameSubCategoryModel.findOne({
            where: {
              masterCasinoGameId: +gameId,
              masterGameSubCategoryId: +subCategoryId
            },
            transaction
          })
          if (!isMapped) {
            await GameSubCategoryModel.create(
              {
                masterCasinoGameId: +gameId,
                masterGameSubCategoryId: +subCategoryId
              },
              { transaction }
            )
          }
        })
      )
      return { status: 200, message: 'Games added successfully', pageDetails }
    } catch (error) {
      console.log(error)
      return this.addError('InternalServerErrorType')
    }
  }
}
