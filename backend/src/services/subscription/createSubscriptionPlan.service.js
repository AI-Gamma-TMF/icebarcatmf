import { Op, Sequelize } from 'sequelize'
import config from '../../configs/app.config'
import ServiceBase from '../../libs/serviceBase'
import { convertToWebPAndUpload, subscriptionFeatureTypeCheck } from '../../utils/common'
import { SUCCESS_MSG } from '../../utils/constants/success'

export class CreateSubscriptionPlanService extends ServiceBase {
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

    const { name, description, monthlyAmount, yearlyAmount, weeklyPurchaseCount, scCoin, gcCoin, platform, isActive, specialPlan, features } = this.args

    const checkSubscriptionExist = await SubscriptionModel.count({ where: { isActive: true } })

    if (checkSubscriptionExist >= 3 && isActive === true) return this.addError('SubscriptionPlanLimitErrorType')

    if (monthlyAmount > yearlyAmount) return this.addError('SubscriptionMonthlyAmountGreaterThanYearlyAmountErrorType')
    if (name) {
      const isSubscriptionNameExist = await SubscriptionModel.findOne({
        where: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('name')), name.trim().toLowerCase()),
        raw: true,
        transaction
      })
      if (isSubscriptionNameExist) { return this.addError('SubscriptionWithSameNameAlreadyExistErrorType') }
    }

    let fileName

    let featuresData
    if (features && typeof features === 'string') {
      featuresData = JSON.parse(features)
      if (featuresData && typeof featuresData === 'string') {
        featuresData = JSON.parse(featuresData)
      }
    }

    if (!featuresData || Object.keys(featuresData).length === 0) return this.addError('SubscriptionFeatureNotExistErrorType')

    const activeFeatures = await SubscriptionFeatureModel.findAll({
      attributes: ['subscriptionFeatureId', 'key', 'valueType'],
      where: {
        isActive: true,
        key: { [Op.in]: Object.keys(featuresData) }
      },
      raw: true,
      transaction
    })

    if (activeFeatures.length !== Object.keys(featuresData).length) return this.addError('SubscriptionFeatureNotExistErrorType')

    const subscriptionFeatureTypeCheckResult = subscriptionFeatureTypeCheck(activeFeatures, featuresData)
    if (!subscriptionFeatureTypeCheckResult) return this.addError('SubscriptionFeatureValueTypeErrorType')

    try {
      if (thumbnail) {
        if (thumbnail && typeof thumbnail === 'object') {
          fileName = `${config.get('env')}/subscription/assets/${name}/-long-${Date.now()}.webp`
          fileName = fileName.split(' ').join('')
          await convertToWebPAndUpload(thumbnail, fileName)
        }
      }

      const createObject = {
        name,
        description,
        monthlyAmount,
        yearlyAmount,
        weeklyPurchaseCount,
        scCoin,
        gcCoin,
        platform,
        isActive,
        specialPlan,
        thumbnail: fileName
      }

      const createdSubscriptionPlan = await SubscriptionModel.create(createObject, { transaction })

      const featureMappingArray = []
      // Mapping Feature with Subscription
      for (const feature of activeFeatures) {
        const featureMapping = {
          subscriptionId: createdSubscriptionPlan.subscriptionId,
          subscriptionFeatureId: feature.subscriptionFeatureId,
          value: featuresData[feature.key]
        }
        featureMappingArray.push(featureMapping)
      }

      await SubscriptionFeatureMapModel.bulkCreate(featureMappingArray, { transaction })

      return {
        success: true,
        data: {
          subscriptionId: createdSubscriptionPlan.subscriptionId
        },
        message: SUCCESS_MSG.CREATE_SUCCESS
      }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
