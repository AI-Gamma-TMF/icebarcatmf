import { Op } from 'sequelize'
import config from '../../configs/app.config'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { removeData, triggerGiveawayChangeNotification, uploadFile, validateFile } from '../../utils/common'
import { OK, LOGICAL_ENTITY } from '../../utils/constants/constant'

/**
 * Provides service to create new affiliate
 * @export
 * @class CreateAffiliateService
 * @extends {ServiceBase}
 */
export class UpdateRaffleService extends ServiceBase {
  async run () {
    const {
      dbModels: { Raffles: RafflesModel },
      sequelizeTransaction: transaction
    } = this.context
    const file = this.context.req.file
    const { id } = this.context.req.body

    const {
      raffleId,
      title,
      subHeading,
      description,
      wagerBaseAmt,
      startDate,
      endDate,
      prizeAmountGc,
      prizeAmountSc,
      wagerBaseAmtType,
      isActive,
      wonDate,
      moreDetails,
      termsAndConditions
    } = this.args

    try {
      const raffleExist = await RafflesModel.findOne({
        where: { raffleId }
      })

      if (!raffleExist) this.addError('GiveawaysNotExistErrorType')

      const gameStartDate = new Date(startDate)
      const gameEndDate = new Date(endDate)
      // const currentDate = new Date()

      if (wagerBaseAmt < 0) return this.addError('AmountShouldNotNegativeErrorType')

      if (!(gameStartDate instanceof Date) || isNaN(gameStartDate) || !(gameEndDate instanceof Date) || isNaN(gameEndDate)) return this.addError('InvalidDateErrorType')

      // if (gameStartDate <= currentDate || gameEndDate <= currentDate || gameStartDate >= gameEndDate || raffleExist.startDate < currentDate.setMinutes(currentDate.getMinutes() + 5)) return this.addError('RaffleAlreadyRunningWithinTimeFrameErrorType')

      // Check if there is any active raffle that overlaps with the given startDate and endDate
      const overlappingRaffle = await RafflesModel.findOne({
        where: {
          raffleId: {
            [Op.ne]: raffleId // Exclude the current raffle
          },
          [Op.or]: [
            {
              startDate: {
                [Op.between]: [startDate, endDate]
              }
            },
            {
              endDate: {
                [Op.between]: [startDate, endDate]
              }
            },
            {
              [Op.and]: [
                { startDate: { [Op.lte]: startDate } },
                { endDate: { [Op.gte]: endDate } }
              ]
            }
          ]
        }
      })

      if (overlappingRaffle) return this.addError('GiveawaysAlreadyRunningWithinTimeFrameErrorType')

      const updateObj = {
        title,
        subHeading,
        description,
        startDate: gameStartDate,
        endDate: gameEndDate,
        prizeAmountGc: prizeAmountGc,
        prizeAmountSc: prizeAmountSc,
        wagerBaseAmt,
        wagerBaseAmtType,
        isActive,
        wonDate,
        moreDetails: moreDetails ? JSON.parse(moreDetails) : null,
        termsAndConditions
      }

      let fileName = ''
      if (file) {
        const fileCheckResponse = validateFile(null, file)
        if (fileCheckResponse !== OK) return this.addError('FileTypeNotSupportedErrorType')

        fileName = `${config.get('env')}/assets/${
          LOGICAL_ENTITY.RAFFLE_BANNER
        }/${raffleId}-${Date.now()}.${file.originalname.split('.')[1]}`
        await uploadFile(file, fileName)

        updateObj.imageUrl = fileName
      }

      await RafflesModel.update(updateObj, {
        where: {
          raffleId
        },
        transaction
      })
      await removeData('activeRaffleDetails')

      triggerGiveawayChangeNotification(title, id, 'updated')

      return {
        success: true,
        message: SUCCESS_MSG.UPDATE_SUCCESS
      }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
