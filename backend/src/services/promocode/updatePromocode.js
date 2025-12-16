import { Op } from 'sequelize'
import ServiceBase from '../../libs/serviceBase'
import { createOptimovePromocode, deleteOptimovePromocode, isDateValid, statusUpdateJobScheduler } from '../../utils/common'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { PROMOCODE_STATUS } from '../../utils/constants/constant'

export class UpdatePromocodeService extends ServiceBase {
  async run () {
    const {
      dbModels: {
        Promocode: PromocodeModel,
        Package: PackageModel,
        CRMPromotion: CRMPromotionModel,
        UserActivities: UserActivitiesModel
      },
      sequelizeTransaction: transaction
    } = this.context

    const { promocodeId, promocode, validTill, validFrom, maxUsersAvailed, perUserLimit, isDiscountOnAmount, discountPercentage, packages, description, promotionName } = this.args

    try {
      const promocodeExist = await PromocodeModel.findOne({
        attributes: ['promocode', 'status', 'crmPromocode'],
        where: { promocodeId: promocodeId },
        transaction,
        raw: true
      })

      if (!promocodeExist) return this.addError('PromocodeNotExistErrorType')

      if ([PROMOCODE_STATUS.EXPIRED, PROMOCODE_STATUS.DELETED].includes(+promocodeExist.status)) return this.addError('PromocodeExpiredErrorType')

      // Current Date
      const currentDate = new Date()

      let promocodeValidFrom, promocodeValidTill, updatedMaxUsersAvailed, updatedPerUserLimit, updatedPackageArray

      // checking the dates
      if (validFrom && validTill) {
        const updatedvalidFrom = new Date(validFrom)
        const updatedvalidTill = new Date(validTill)
        if (
          isDateValid(updatedvalidFrom) &&
          isDateValid(updatedvalidTill) &&
          updatedvalidFrom >= currentDate &&
          updatedvalidTill >= currentDate &&
          updatedvalidFrom <= updatedvalidTill &&
          +promocodeExist.status === PROMOCODE_STATUS.UPCOMING
        ) {
          promocodeValidFrom = updatedvalidFrom
          promocodeValidTill = updatedvalidTill
        } else {
          this.addError('InvalidDateErrorType')
        }
      } else if (validFrom) {
        const updatedvalidFrom = new Date(validFrom)
        if (
          !isDateValid(updatedvalidFrom) ||
          updatedvalidFrom < currentDate ||
          updatedvalidFrom > promocodeExist?.validTill
        ) {
          this.addError('InvalidDateErrorType')
        } else if (+promocodeExist.status === PROMOCODE_STATUS.ACTIVE) {
          this.addError('PromocodeIsAlreadyActiveErrorType')
        } else {
          promocodeValidFrom = updatedvalidFrom
        }
      } else if (validTill) {
        const updatedvalidTill = new Date(validTill)
        if (
          !isDateValid(updatedvalidTill) ||
          updatedvalidTill < currentDate ||
          promocodeExist?.validFrom > updatedvalidTill
        ) {
          this.addError('InvalidDateErrorType')
        } else {
          promocodeValidTill = updatedvalidTill
        }
      }

      // Maximum user availed update check
      if (maxUsersAvailed !== null && maxUsersAvailed !== 0) {
        const alreadyClaimedCount = await UserActivitiesModel.count({
          where: { promocodeId: promocodeId },
          transaction,
          raw: true
        })
        if (alreadyClaimedCount && alreadyClaimedCount > maxUsersAvailed) return this.addError('UsersAlreadyAppliedPromocodeErrorType')
        updatedMaxUsersAvailed = maxUsersAvailed
      }
      if (perUserLimit !== undefined) updatedPerUserLimit = perUserLimit

      if (isDiscountOnAmount && discountPercentage > 99) return this.addError('InvalidPercentageValueErrorType')

      if (packages && packages.length) {
        const packageIds = (
          await PackageModel.findAll({
            where: { packageId: { [Op.in]: packages }, isActive: true },
            attributes: ['packageId'],
            transaction,
            raw: true
          })
        ).map(packageData => { return packageData.packageId })
        updatedPackageArray = packageIds
      }

      const updateObj = {
        promocode: promocode,
        isDiscountOnAmount: isDiscountOnAmount,
        discountPercentage: discountPercentage,
        description: description,
        perUserLimit: updatedPerUserLimit,
        maxUsersAvailed: updatedMaxUsersAvailed,
        package: updatedPackageArray,
        validFrom: promocodeValidFrom,
        validTill: promocodeValidTill
      }

      // If promocode is crm promocode then update crm promocode model also

      if (promocodeExist.crmPromocode) {
        if ((promocode || promotionName)) {
          // Cannot update crm promocode if promocode is already active
          if (promocodeExist.status === PROMOCODE_STATUS.ACTIVE) return this.addError('CrmPromocodeIsAlreadyActiveErrorType')
          const isCrmPromoExist = await CRMPromotionModel.findOne({
            attributes: ['promocode', 'crmPromotionId', 'name'],
            where: { promocode: promocodeExist.promocode },
            transaction,
            raw: true
          })
          if (!isCrmPromoExist) return this.addError('PromocodeNotExistErrorType')
          const updatedCrmPromocode = promocode || isCrmPromoExist.promocode
          const updatedCrmPromocodeName = promotionName || isCrmPromoExist.name

          // Updating the promocodes in Optimove server and DB
          await Promise.all([
            deleteOptimovePromocode(isCrmPromoExist.promocode),
            createOptimovePromocode(updatedCrmPromocode, updatedCrmPromocodeName),
            CRMPromotionModel.update({ promocode: updatedCrmPromocode, name: updatedCrmPromocodeName }, { where: { crmPromotionId: isCrmPromoExist.crmPromotionId }, transaction }),
            PromocodeModel.update(updateObj, { where: { promocodeId: promocodeId }, transaction })])
        } else {
          // No need to update crm promocode in crm promotion table and optimove server
          await PromocodeModel.update(updateObj, { where: { promocodeId: promocodeId }, transaction })
        }
        return {
          success: true,
          message: SUCCESS_MSG.UPDATE_SUCCESS
        }
      }

      await PromocodeModel.update(updateObj, { where: { promocodeId: promocodeId }, transaction })
      // schedule the jobs to update the purchase promocode times through cron
      statusUpdateJobScheduler('PUT', 'promocode', +promocodeId)

      return {
        success: true,
        message: SUCCESS_MSG.UPDATE_SUCCESS
      }
    } catch (error) {
      return this.addError('InternalServerErrorType', error)
    }
  }
}
