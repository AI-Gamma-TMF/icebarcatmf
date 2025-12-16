import { Op } from 'sequelize'
import ServiceBase from '../../libs/serviceBase'
import { statusUpdateJobScheduler } from '../../utils/common'
import { AddCRMPromocodeService } from '../crmPromotions'
import { PROMOCODE_STATUS } from '../../utils/constants/constant'

export class CreatePromocodesService extends ServiceBase {
  async run () {
    const {
      dbModels: {
        Promocode: PromocodeModel,
        Package: PackageModel,
        CRMPromotion: CRMPromotionModel
      },
      sequelizeTransaction: transaction
    } = this.context

    const { promocode, maxUsersAvailed, perUserLimit, isDiscountOnAmount, discountPercentage, packages, crmPromocode, promotionName = '', promotionType, description, validTill, validFrom } = this.args

    try {
      const promocodeExist = await PromocodeModel.findOne({
        attributes: ['promocode'],
        where: { promocode: promocode },
        transaction,
        raw: true
      })

      if (promocodeExist) return this.addError('PromocodeAlreadyExistErrorType')

      // purshase return error
      if (!crmPromocode && !validTill && !validFrom) return this.addError('ValidTillValidFromRequiredErrorType')
      if (isDiscountOnAmount && discountPercentage > 99) return this.addError('InvalidPercentageValueErrorType')
      if (crmPromocode && (promotionName === '' || !promotionType)) return this.addError('PromocodeCrmRequiredFieldErrorType')
      // Promocode Validity
      let promocodeValidFrom, promocodeValidTill
      if (validFrom && validTill) {
        promocodeValidFrom = new Date(validFrom)
        promocodeValidTill = new Date(validTill)
        if (
          !(promocodeValidFrom instanceof Date) ||
          isNaN(promocodeValidFrom) ||
          !(promocodeValidTill instanceof Date) ||
          isNaN(promocodeValidTill) ||
          promocodeValidFrom <= new Date() ||
          promocodeValidTill <= new Date() ||
          promocodeValidFrom >= promocodeValidTill
        ) { return this.addError('InvalidDateErrorType') }
      }
      let packageQuery
      if (packages && packages?.length) {
        packageQuery = { packageId: { [Op.in]: packages }, isActive: true }
      } else {
        packageQuery = { [Op.and]: [{ firstPurchaseApplicable: false }, { welcomePurchaseBonusApplicable: false }], isActive: true }
      }
      const packageIds = (
        await PackageModel.findAll({
          where: packageQuery,
          attributes: ['packageId'],
          transaction,
          raw: true
        })
      ).map(packageData => { return packageData.packageId })

      const createPromocodeObject = {
        promocode,
        status: PROMOCODE_STATUS.UPCOMING,
        discountPercentage,
        perUserLimit,
        isDiscountOnAmount,
        crmPromocode,
        promotionName,
        promotionType,
        description,
        validFrom: promocodeValidFrom,
        validTill: promocodeValidTill,
        ...(maxUsersAvailed > 0 ? { maxUsersAvailed } : {}), // check if maxUsersAvailed is provided else don't pass
        package: packageIds
      }
      // check if Promocode is crmPromocode and crmPromocode is true
      if (crmPromocode && promotionName && promotionType) {
        const findPromocode = await CRMPromotionModel.findOne({
          attributes: ['promocode'],
          where: { promocode },
          transaction,
          raw: true
        })
        if (findPromocode) return this.addError('PromocodeAlreadyExistInCrmErrorType')
        // Need to update the crmPromocode table
        const { result, successful } = await AddCRMPromocodeService.execute({ promocode, name: promotionName, promotionType, crmPromocode, validFrom: promocodeValidFrom, validTill: promocodeValidTill }, this.context)

        // Creating a Promocode in existing table Promocode
        if (!successful) return this.addError('InternalServerErrorType', result)
        const createdPromocode = await PromocodeModel.create(createPromocodeObject, { transaction })
        return {
          success: true,
          data: { promocodeId: createdPromocode.promocodeId },
          message: 'Promocode Created Successfully'
        }
      }

      // Creating a Promocode in existing table Promocode
      const createdPromocode = await PromocodeModel.create(createPromocodeObject, { transaction })

      statusUpdateJobScheduler('POST', 'promocode', +createdPromocode.promocodeId)

      return {
        success: true,
        data: { promocodeId: createdPromocode.promocodeId },
        message: 'Promocode Created Successfully'
      }
    } catch (error) {
      return this.addError('InternalServerErrorType', error)
    }
  }
}
