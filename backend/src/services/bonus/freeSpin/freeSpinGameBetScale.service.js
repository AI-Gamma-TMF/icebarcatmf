import { Op } from 'sequelize'
import { round } from 'number-precision'
import ServiceBase from '../../../libs/serviceBase'
import { FREE_SPIN_AGGREGATOR } from '../../../utils/constants/constant'
import { SUCCESS_MSG } from '../../../utils/constants/success'
import { sequelize } from '../../../db/models'

export class FreeSpinGameBetScaleAmountService extends ServiceBase {
  async run () {
    const {
      dbModels: { MasterCasinoGame: MasterCasinoGameModel, MasterCasinoProvider: MasterCasinoProvideModel, MasterGameAggregator: MasterGameAggregatorModel }
    } = this.context

    const { masterCasinoProviderId, masterCasinoGameId, coinType = 'SC' } = this.args
    try {
      const isProviderExist = await MasterCasinoProvideModel.findOne({
        attributes: ['name', sequelize.literal('"MasterGameAggregator"."name" AS "aggregatorName"')],
        where: {
          masterCasinoProviderId: +masterCasinoProviderId,
          isActive: true
        },
        include: {
          model: MasterGameAggregatorModel,
          attributes: [],
          required: true,
          where: {
            freeSpinAllowed: true,
            isActive: true,
            adminEnabledFreespin: true
          }
        },
        raw: true
      })

      if (!isProviderExist) {
        return this.addError('CasinoProviderNotFoundErrorType')
      }

      const aggregatorName = isProviderExist?.aggregatorName.toUpperCase()
      let totalBetAmountList = []

      const betScaleList = await MasterCasinoGameModel.findOne({
        attributes: ['freeSpinBetScaleAmount', 'moreDetails'],
        where: {
          masterCasinoProviderId: +masterCasinoProviderId,
          masterCasinoGameId: +masterCasinoGameId,
          hasFreespins: true,
          freeSpinBetScaleAmount: { [Op.not]: null }
        },
        raw: true
      })

      if (!betScaleList) {
        return this.addError('FreeSpinBetScaleAmountIsNotDefineErrorType')
      }

      switch (aggregatorName) {
        case FREE_SPIN_AGGREGATOR.PRAGMATIC:
          totalBetAmountList = betScaleList?.freeSpinBetScaleAmount[coinType]?.totalBetScales
          break
        case FREE_SPIN_AGGREGATOR.EVOPLAY:
          totalBetAmountList = betScaleList?.freeSpinBetScaleAmount?.betInMoney?.[coinType]
          break
        case FREE_SPIN_AGGREGATOR.MANCALA: {
          const currencyBetPerLine = betScaleList?.freeSpinBetScaleAmount[coinType]
          totalBetAmountList = this.calculateTotalBetForMancala(currencyBetPerLine)
          break
        }
        case FREE_SPIN_AGGREGATOR.BGAMING: {
          const currencyBetPerLine = betScaleList?.freeSpinBetScaleAmount[coinType]
          totalBetAmountList = this.calculateTotalBetForBgaming(currencyBetPerLine)
          break
        }
        case FREE_SPIN_AGGREGATOR.RUBYPLAY:
          totalBetAmountList = betScaleList?.freeSpinBetScaleAmount[coinType]?.totalBetScales
          break
        case FREE_SPIN_AGGREGATOR.ALEA:
          totalBetAmountList = betScaleList?.freeSpinBetScaleAmount?.SC?.totalBetScales
          break
        case FREE_SPIN_AGGREGATOR.GAMZIX : {
          totalBetAmountList = betScaleList?.freeSpinBetScaleAmount[coinType]?.betPerLineScales
          break
        }
        case FREE_SPIN_AGGREGATOR.MASCOT: {
          totalBetAmountList = (betScaleList?.moreDetails?.[`Denominations${coinType}`] || []).map(
            denom => denom * (betScaleList?.moreDetails?.baseBet || 1)
          )
          break
        }
        case FREE_SPIN_AGGREGATOR.BOOMING : {
          totalBetAmountList = betScaleList?.freeSpinBetScaleAmount[coinType]?.totalBetScales
          break
        }
        default:
          break
      }

      return { totalBetAmountList, message: SUCCESS_MSG.GET_SUCCESS, success: true }
    } catch (error) {
      console.log('Error in GetGameListAllowSpinService', error)
      return this.addError('InternalServerErrorType', error.message)
    }
  }

  calculateTotalBetForMancala (currencyBetPerLine) {
    const CoinPrice = currencyBetPerLine?.CoinPrice
    const AvailableLinesCount = currencyBetPerLine?.AvailableLinesCount[0]
    const betPerLineArray = currencyBetPerLine?.betPerLineScales || []
    const result = betPerLineArray.map(betPerLine => {
      const total = CoinPrice * AvailableLinesCount * betPerLine
      return round(total, 2)
    })
    return result
  }

  calculateTotalBetForBgaming (currencyBetPerLine) {
    const lineCount = currencyBetPerLine?.lineCount
    const betPerLineArray = currencyBetPerLine?.betLevels || []
    const betType = currencyBetPerLine?.betType || 'Bet Per Line'

    const result = betPerLineArray.map(betPerLine => {
      let total = 0
      if (betType === 'Bet Per Line') {
        total = (lineCount * betPerLine) / 100 // cents to dollar
      } else if (betType === 'Total Bet') {
        total = betPerLine / 100
      }
      return round(total, 2)
    })
    return result
  }
}
