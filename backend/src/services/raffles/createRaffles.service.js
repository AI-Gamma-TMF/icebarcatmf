import { Op } from 'sequelize'
import config from '../../configs/app.config'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { OK, LOGICAL_ENTITY } from '../../utils/constants/constant'
import { removeData, triggerGiveawayNotification, uploadFile, validateFile } from '../../utils/common'

/**
 * Provides service to create new affiliate
 * @export
 * @class CreateAffiliateService
 * @extends {ServiceBase}
 */
export class CreateRaffleService extends ServiceBase {
  async run () {
    const {
      dbModels: { Raffles: RafflesModel },
      sequelizeTransaction: transaction
    } = this.context
    const file = this.context.req.file

    const { id, title, subHeading, description, wagerBaseAmt, wagerBaseAmtType, startDate, endDate, prizeAmountGc, prizeAmountSc, termsAndConditions, moreDetails } = this.args

    const gameStartDate = new Date(startDate) // Timestamp from FE
    const gameEndDate = new Date(endDate) // Timestamp for FE

    if (wagerBaseAmt < 0) return this.addError('AmountShouldNotNegativeErrorType')

    if (!(gameStartDate instanceof Date) || isNaN(gameStartDate) || !(gameEndDate instanceof Date) || isNaN(gameEndDate)) return this.addError('InvalidDateErrorType')

    const raffleExist = await RafflesModel.findOne({
      where: {
        [Op.or]: [
          {
            startDate: {
              [Op.between]: [gameStartDate, gameEndDate]
            }
          },
          {
            endDate: {
              [Op.between]: [gameStartDate, gameEndDate]
            }
          },
          {
            [Op.and]: [
              { startDate: { [Op.lte]: gameStartDate } },
              { endDate: { [Op.gte]: gameEndDate } }
            ]
          }
        ]
      }
    })

    if (raffleExist) return this.addError('GiveawaysAlreadyRunningWithinTimeFrameErrorType')

    const createObj = {
      title,
      subHeading,
      description,
      wagerBaseAmt,
      startDate: gameStartDate,
      endDate: gameEndDate,
      wagerBaseAmtType,
      prizeAmountGc: prizeAmountGc,
      prizeAmountSc: prizeAmountSc,
      termsAndConditions,
      isActive: true,
      moreDetails: moreDetails ? JSON.parse(moreDetails) : null
    }

    const createNewRaffle = await RafflesModel.create(createObj, {
      transaction
    })

    let fileName = ''
    if (file) {
      const fileCheckResponse = validateFile(null, file)
      if (fileCheckResponse !== OK) return this.addError('FileTypeNotSupportedErrorType')

      fileName = `${config.get('env')}/assets/${LOGICAL_ENTITY.RAFFLE_BANNER}${createNewRaffle.raffleId}-${Date.now()}.${file.originalname.split('.')[1]}`
      await uploadFile(file, fileName)
    }

    if (fileName) {
      await RafflesModel.update(
        { imageUrl: fileName },
        {
          where: {
            raffleId: createNewRaffle.raffleId
          },
          transaction
        }
      )
    }

    await removeData('activeRaffleDetails')

    triggerGiveawayNotification(
      title,
      prizeAmountGc,
      prizeAmountSc,
      id,
      'added'
    )

    return {
      success: true,
      message: `${SUCCESS_MSG.CREATE_SUCCESS}`
    }
  }
}
