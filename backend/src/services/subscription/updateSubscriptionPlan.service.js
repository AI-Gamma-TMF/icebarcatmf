import { Op, Sequelize } from 'sequelize'
import config from '../../configs/app.config'
import ServiceBase from '../../libs/serviceBase'
import { convertToWebPAndUpload, removeData, subscriptionFeatureTypeCheck } from '../../utils/common'
import { SUCCESS_MSG } from '../../utils/constants/success'

export class UpdateSubscriptionPlanService extends ServiceBase {
  async run () {
    const {
      dbModels: {
        Subscription: SubscriptionModel,
        SubscriptionFeature: SubscriptionFeatureModel,
        SubscriptionFeatureMap: SubscriptionFeatureMapModel
      },
      req: { file: thumbnail },
      sequelizeTransaction: transaction
    } = this.context

    const { name, description, monthlyAmount, yearlyAmount, weeklyPurchaseCount, scCoin, gcCoin, platform, isActive, specialPlan, features, subscriptionId } = this.args

    let fileName

    const checkSubscriptionExist = await SubscriptionModel.findOne({ attributes: ['subscriptionId', 'isActive', 'monthlyAmount', 'yearlyAmount'], where: { subscriptionId }, raw: true, transaction })

    if (!checkSubscriptionExist) return this.addError('SubscriptionPlanNotExistErrorType')

    // checking subscription plan limit
    if (isActive) {
      const activeSubscriptionCount = await SubscriptionModel.count({ where: { isActive: true } })
      if (activeSubscriptionCount >= 3) return this.addError('SubscriptionPlanLimitErrorType')
    }

    if (monthlyAmount || yearlyAmount) {
      if (monthlyAmount && yearlyAmount && monthlyAmount > yearlyAmount) return this.addError('SubscriptionMonthlyAmountGreaterThanYearlyAmountErrorType')
      if (monthlyAmount && monthlyAmount > checkSubscriptionExist.yearlyAmount) return this.addError('SubscriptionMonthlyAmountGreaterThanYearlyAmountErrorType')
      if (yearlyAmount && yearlyAmount < checkSubscriptionExist.monthlyAmount) return this.addError('SubscriptionMonthlyAmountGreaterThanYearlyAmountErrorType')
    }

    const updateSubscriptionObj = {
      description,
      monthlyAmount,
      yearlyAmount,
      scCoin,
      gcCoin,
      platform,
      isActive,
      specialPlan
    }
    // Updating name, check if name is unique
    if (name) {
      const isSubscriptionNameExist = await SubscriptionModel.findOne({
        where: {
          [Op.and]: [
            Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('name')), name.trim().toLowerCase()),
            { subscriptionId: { [Op.notIn]: [checkSubscriptionExist.subscriptionId] } }
          ]
        },
        transaction,
        raw: true
      })
      if (isSubscriptionNameExist) {
        return this.addError('SubscriptionWithSameNameAlreadyExistErrorType')
      }
      updateSubscriptionObj.name = name
    }

    // Weekly Purchase count remove from redis
    if (weeklyPurchaseCount !== undefined) {
      await removeData(`subscriptionWeeklyCount:${checkSubscriptionExist.subscriptionId}`)
      updateSubscriptionObj.weeklyPurchaseCount = weeklyPurchaseCount
    }
    // updating Thumbnail
    if (thumbnail) {
      if (thumbnail && typeof thumbnail === 'object') {
        fileName = `${config.get('env')}/subscription/assets/${name || checkSubscriptionExist?.name}/-updated-long-${Date.now()}.webp`
        fileName = fileName.split(' ').join('')
        if (checkSubscriptionExist.thumbnail) {
          const key = checkSubscriptionExist.thumbnail.split(' ').join('')
          await convertToWebPAndUpload(thumbnail, fileName, key)
        } else {
          await convertToWebPAndUpload(thumbnail, fileName)
        }
        updateSubscriptionObj.thumbnail = fileName
      }
    }

    // updating features constraints

    if (features) {
      let featuresData
      // Deserialize features Obj
      if (features && typeof features === 'string') {
        featuresData = JSON.parse(features)
        if (featuresData && typeof featuresData === 'string') {
          featuresData = JSON.parse(featuresData)
        }
      }

      if (!featuresData || Object.keys(featuresData).length === 0) return this.addError('SubscriptionFeatureNotExistErrorType')

      const activeFeatures = await SubscriptionFeatureModel.findAll({
        attributes: ['subscriptionFeatureId', 'key', 'valueType'],
        where: { isActive: true, key: { [Op.in]: Object.keys(featuresData) } },
        raw: true,
        transaction
      })

      if (activeFeatures.length !== Object.keys(featuresData).length) return this.addError('SubscriptionFeatureNotExistErrorType')

      const subscriptionFeatureTypeCheckResult = subscriptionFeatureTypeCheck(activeFeatures, featuresData)
      if (!subscriptionFeatureTypeCheckResult) return this.addError('SubscriptionFeatureValueTypeErrorType')

      const featureMappingArray = []
      // Mapping Feature with Subscription
      for (const feature of activeFeatures) {
        const featureMapping = {
          subscriptionId: checkSubscriptionExist.subscriptionId,
          subscriptionFeatureId: feature.subscriptionFeatureId,
          value: featuresData[feature.key]
        }
        featureMappingArray.push(featureMapping)
      }

      await SubscriptionFeatureMapModel.destroy({ where: { subscriptionId: checkSubscriptionExist.subscriptionId }, transaction })

      await Promise.all([SubscriptionFeatureMapModel.bulkCreate(featureMappingArray, { transaction }), removeData(`subscriptionFeature:${subscriptionId}`)])
    }
    try {
      await Promise.all([SubscriptionModel.update(updateSubscriptionObj, { where: { subscriptionId }, transaction }),
        removeData(`subscription:${subscriptionId}`),
        removeData('active-subscription-feature')])

      return {
        success: true,
        message: SUCCESS_MSG.UPDATE_SUCCESS
      }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
