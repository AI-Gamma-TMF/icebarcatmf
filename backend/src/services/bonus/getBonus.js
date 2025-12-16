import { Op } from 'sequelize'
import ajv from '../../libs/ajv'
import config from '../../configs/app.config'
import ServiceBase from '../../libs/serviceBase'
import { pageValidation } from '../../utils/common'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { BONUS_STATUS, BONUS_TYPE } from '../../utils/constants/constant'
const s3Config = config.getProperties().s3

const schema = {
  type: 'object',
  properties: {
    limit: { type: ['string', 'null'] },
    pageNo: { type: ['string', 'null'] },
    search: { type: ['string', 'null'] },
    isActive: { enum: ['true', 'false', 'null'] },
    sort: { type: ['string', 'null'] },
    orderBy: { type: ['string', 'null'] },
    bonusId: { type: ['string', 'null'] },
    bonusType: { enum: Object.values(BONUS_TYPE) }
  },
  required: []
}

const constraints = ajv.compile(schema)

export class GetBonus extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      Bonus: BonusModel,
      UserBonus,
      GlobalSetting: GlobalSettingModel,
      ScratchCards: ScratchCardsModel,
      FreeSpinBonusGrant: FreeSpinBonusGrantModel
    } = this.context.dbModels
    let { orderBy, pageNo, limit, sort, search, isActive, bonusType, bonusId } = this.args
    let query
    let bonusDetails

    try {
      const { page, size } = pageValidation(pageNo, limit)
      if (bonusId) {
        if (isNaN(bonusId)) {
          return this.addError('InvalidIdErrorType')
        } else {
          query = { ...query, bonusId: bonusId, bonusType: { [Op.notIn]: [BONUS_TYPE.TIER_BONUS, BONUS_TYPE.WEEKLY_TIER_BONUS, BONUS_TYPE.MONTHLY_TIER_BONUS, BONUS_TYPE.PROVIDER_BONUS, BONUS_TYPE.VIP_QUESTIONNAIRE_BONUS] } }
          // // if (pageNo && limit) {
          // //   query = {
          // //     ...query,
          // //     [Op.not]: { // Exclude DAILY_BONUS where day is NOT NULL
          // //       [Op.and]: [
          // //         { bonusType: BONUS_TYPE.DAILY_BONUS },
          // //         { day: { [Op.ne]: null } }
          // //       ]
          // //     }
          // //   }

          // //   console.log(">>>>>>>>>>>>>>>>>limitquery>>>>>>>>>>>>>>>>>", query)
          // // }
          // console.log(">>>>>>>>>>>>>>>>>query>>>>>>>>>>>>>>>>>", query)
          bonusDetails = await BonusModel.findAndCountAll({
            where: { ...query },
            include: [
              {
                as: 'scratchCard',
                model: ScratchCardsModel,
                attributes: ['scratchCardName']
              },
              {
                model: FreeSpinBonusGrantModel,
                as: 'freeSpinBonus',
                attributes: ['freeSpinId', 'title', 'status']
              }
            ]
          })

          if (bonusDetails) {
            await Promise.all(bonusDetails.rows.map(async (bonus) => {
              if (bonus.imageUrl) {
                bonus.imageUrl = `${s3Config.S3_DOMAIN_KEY_PREFIX}${bonus.imageUrl}`
              }
              if (bonus.bonusType === BONUS_TYPE.WHEEL_SPIN_BONUS) {
                const [{ value: MINIMUM_SC_SPIN_LIMIT }, { value: MINIMUM_GC_SPIN_LIMIT }] = await GlobalSettingModel.findAll({
                  attributes: ['key', 'value'],
                  where: {
                    key: ['MINIMUM_SC_SPIN_LIMIT', 'MINIMUM_GC_SPIN_LIMIT']
                  }
                })
                bonus.dataValues.scSpinLimit = +MINIMUM_SC_SPIN_LIMIT || 0
                bonus.dataValues.gcSpinLimit = +MINIMUM_GC_SPIN_LIMIT || 0
              }
              // Postal Code Bonus Global Settings
              if (bonus.bonusType === BONUS_TYPE.POSTAL_CODE_BONUS) {
                const [{ value: POSTAL_CODE_TIME }, { value: POSTAL_CODE_VALID_TILL }] = await GlobalSettingModel.findAll({
                  attributes: ['key', 'value'],
                  where: {
                    key: ['POSTAL_CODE_TIME', 'POSTAL_CODE_VALID_TILL']
                  }
                })
                bonus.dataValues.postalCodeIntervalInMinutes = +POSTAL_CODE_TIME || 5
                bonus.dataValues.postalCodeValidityInDays = +POSTAL_CODE_VALID_TILL || 15
              }
            }))
          }
          return { bonus: bonusDetails, message: SUCCESS_MSG.GET_SUCCESS, success: true }
        }
      }
      if (isActive) {
        isActive = isActive !== 'false'
        query = { ...query, isActive: isActive }
      }

      if (bonusType && bonusType === BONUS_TYPE.REFERRAL_BONUS) {
        query = { ...query, bonusType: bonusType, minimumPurchase: { [Op.ne]: null } }
        orderBy = 'minimumPurchase'
      } else if (bonusType && bonusType === BONUS_TYPE.DAILY_BONUS) {
        query = { ...query, bonusType: bonusType, day: { [Op.ne]: null } }
      } else if (bonusType) {
        query = { ...query, bonusType: bonusType }
      } else {
        query = { ...query, minimumPurchase: null }
      }

      query = { ...query, bonusType: { [Op.notIn]: [BONUS_TYPE.TIER_BONUS, BONUS_TYPE.WEEKLY_TIER_BONUS, BONUS_TYPE.MONTHLY_TIER_BONUS, BONUS_TYPE.PROVIDER_BONUS, BONUS_TYPE.VIP_QUESTIONNAIRE_BONUS] } }
      if (pageNo && limit) {
        query = {
          ...query,
          [Op.not]: { // Exclude DAILY_BONUS where day is NOT NULL
            [Op.and]: [
              { bonusType: BONUS_TYPE.DAILY_BONUS },
              { day: { [Op.ne]: null } }
            ]
          }
        }
      }
      if (search) {
        query = {
          ...query,
          bonusName: { [Op.iLike]: `%${search}%` }
        }
      }
      if (!orderBy) {
        orderBy = 'bonusId'
      }
      if (!sort) {
        sort = 'ASC'
      }

      bonusDetails = await BonusModel.findAndCountAll({
        where: { ...query },
        limit: size,
        offset: ((page - 1) * size),
        include: [
          {
            as: 'scratchCard',
            model: ScratchCardsModel,
            attributes: ['scratchCardName']
          },
          {
            model: FreeSpinBonusGrantModel,
            as: 'freeSpinBonus',
            attributes: ['freeSpinId', 'title', 'status']
          }
        ],
        order: [[orderBy, sort]]
      })

      if (bonusDetails.count) {
        await Promise.all(bonusDetails.rows.map(async (bonus) => {
          if (bonus.imageUrl) {
            bonus.imageUrl = `${s3Config.S3_DOMAIN_KEY_PREFIX}${bonus.imageUrl}`
          }
          const useCount = await UserBonus.count({ where: { bonusId: bonus.bonusId, status: BONUS_STATUS.CLAIMED } })
          bonus.claimedCount = useCount
        }))
      }
      return { bonus: bonusDetails, success: true, message: SUCCESS_MSG.GET_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
