import ServiceBase from '../../libs/serviceBase'
import { DeletePromocodeService } from './deletePromocode'
import { CreatePromocodesService } from './createPromocode'
import { PROMOCODE_STATUS } from '../../utils/constants/constant'

export class ReusePromocodesService extends ServiceBase {
  async run () {
    const {
      dbModels: {
        Promocode: PromocodeModel,
        TransactionBanking: TransactionBankingModel
      },
      sequelizeTransaction: transaction
    } = this.context

    const { promocodeId, validFrom, validTill, maxUsersAvailed, perUserLimit } = this.args

    try {
      const isPromocodeExist = await PromocodeModel.findOne({
        where: { promocodeId },
        transaction,
        raw: true
      })

      if (!isPromocodeExist) return this.addError('PromocodeNotExistErrorType')

      if ([PROMOCODE_STATUS.UPCOMING, PROMOCODE_STATUS.DELETED].includes(isPromocodeExist.status)) return this.addError('PromocodeUpcomingActiveReuseErrorType')

      if (+isPromocodeExist.status === PROMOCODE_STATUS.ACTIVE) {
        const promoCount = await TransactionBankingModel.count({ where: { promocodeId }, transaction })
        if (+promoCount === 0) return this.addError('NoNeedToCreateTPromocodeErrorType')
      }

      const promocodeValidFrom = new Date(validFrom)
      const promocodeValidTill = new Date(validTill)
      // Promocode Validity
      if (
        !(promocodeValidFrom instanceof Date) ||
        isNaN(promocodeValidFrom) ||
        !(promocodeValidTill instanceof Date) ||
        isNaN(promocodeValidTill) ||
        promocodeValidFrom <= new Date() ||
        promocodeValidTill <= new Date() ||
        promocodeValidFrom >= promocodeValidTill
      ) { return this.addError('InvalidDateErrorType') }

      let option = {
        promocode: isPromocodeExist?.promocode,
        isDiscountOnAmount: isPromocodeExist?.isDiscountOnAmount,
        discountPercentage: isPromocodeExist?.discountPercentage,
        perUserLimit: +perUserLimit,
        packages: isPromocodeExist?.package || [],
        validTill: validTill,
        validFrom: validFrom,
        status: PROMOCODE_STATUS.UPCOMING
      }

      if (maxUsersAvailed || maxUsersAvailed !== 0) option = { ...option, maxUsersAvailed }

      await DeletePromocodeService.run({ promocodeId, promocode: isPromocodeExist?.promocode }, this.context)
      const result = await CreatePromocodesService.run(option, this.context)
      return result
    } catch (error) {
      return this.addError('InternalServerErrorType', error)
    }
  }
}
