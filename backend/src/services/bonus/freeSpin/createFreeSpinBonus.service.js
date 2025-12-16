import { sequelize } from '../../../db/models'
import { Sequelize } from 'sequelize'
import ServiceBase from '../../../libs/serviceBase'
import {
  getCachedData,
  isDateValid,
  notifyUserByEmailJobScheduler,
  removeData,
  statusUpdateJobScheduler
} from '../../../utils/common'
import {
  BONUS_STATUS,
  BONUS_TYPE,
  FREE_SPIN_TYPE,
  FREE_SPINS_STATUS
} from '../../../utils/constants/constant'
import { SUCCESS_MSG } from '../../../utils/constants/success'

export class CreateFreeSpinBonusService extends ServiceBase {
  async run () {
    const {
      dbModels: {
        FreeSpinBonusGrant: FreeSpinBonusGrantModel,
        Bonus: BonusModel,
        UserBonus: UserBonusModel,
        EmailTemplates: EmailTemplatesModel
      },
      sequelizeTransaction: transaction
    } = this.context

    let {
      providerId,
      masterCasinoGameId,
      isUserUploadCsv = false,
      users = [],
      freeSpinAmount,
      freeSpinRound,
      startDate,
      endDate,
      coinType,
      title,
      isNotifyUser,
      freeSpinType,
      emailTemplateId,
      daysValidity
    } = this.args

    let createObj = {}
    try {
      let freeSpinStartDate = null
      let freeSpinEndDate = null

      startDate = startDate && startDate.trim() !== '' ? startDate : null
      endDate = endDate && endDate.trim() !== '' ? endDate : null

      if (startDate && endDate) {
        freeSpinStartDate = new Date(startDate)
        freeSpinEndDate = new Date(endDate)
        if (!isDateValid(freeSpinStartDate) || !isDateValid(freeSpinEndDate) || freeSpinEndDate <= new Date() || freeSpinStartDate >= freeSpinEndDate) { return this.addError('InvalidDateErrorType') }
      } else {
        // by default 3 days for expiration when bonus get
        daysValidity = +daysValidity || 3
      }

      const isBonusExist = await BonusModel.findOne({
        attributes: ['bonusId'],
        where: {
          bonusType: BONUS_TYPE.FREE_SPIN_BONUS,
          isActive: true
        },
        raw: true,
        transaction
      })

      if (!isBonusExist) {
        return { success: false, message: 'FreeSpinBonusNotFound' }
      }

      // check title already exist
      if (title) {
        const titleName = title.trim().toLowerCase()
        const isTitleExist = await FreeSpinBonusGrantModel.findOne({
          where: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('title')), titleName),
          transaction
        })

        if (isTitleExist) {
          return this.addError('FreeSpinWithSameTitleAlreadyExistErrorType')
        }
        createObj.title = title
      }

      const rawQuery = `SELECT
                        master_casino_game_id AS "masterCasinoGameId",
                        game_name AS "gameName",
                        game_identifier AS "gameIdentifier",
                        free_spins_allowed AS "freeSpinsAllowed",
                        provider_id AS "masterCasinoProviderId",
                        provider_name AS "providerName",
                        aggregator_id AS "masterGameAggregatorId",
                        aggregator_name AS "aggregatorName"
                        FROM
                         public.game_data_view where master_casino_game_id = :masterCasinoGameId and provider_id = :providerId`

      const [isGameExist] = await sequelize.query(rawQuery, {
        type: sequelize.QueryTypes.SELECT,
        replacements: {
          masterCasinoGameId: +masterCasinoGameId,
          providerId: +providerId
        },
        transaction
      })

      if (!isGameExist) {
        return this.addError('CasinoGameNotExistsErrorType')
      }

      // create free Spin here:
      createObj = {
        ...createObj,
        providerId: +providerId,
        masterCasinoGameId: +masterCasinoGameId,
        freeSpinAmount,
        freeSpinRound,
        title,
        startDate: freeSpinStartDate || null,
        endDate: freeSpinEndDate || null,
        status: (freeSpinStartDate && freeSpinEndDate) ? FREE_SPINS_STATUS.UPCOMING : FREE_SPINS_STATUS.RUNNING,
        coinType: coinType.toUpperCase() === 'GC' ? 'GC' : 'SC',
        isNotifyUser,
        moreDetails: { emailTemplateId },
        freeSpinType: Object.values(FREE_SPIN_TYPE).includes(freeSpinType) ? freeSpinType : FREE_SPIN_TYPE.DIRECT_GRANT,
        daysValidity: daysValidity || null
      }

      const createFreeSpin = await FreeSpinBonusGrantModel.create(createObj, {
        transaction
      })

      if (freeSpinType === FREE_SPIN_TYPE.DIRECT_GRANT && (isUserUploadCsv || users?.length > 0)) {
        // 1. check user for grant
        const allUserIds = []
        const allUserEmails = []

        if (isUserUploadCsv) {
          const userCategoryJson = await getCachedData('user-status-freeSpin-user-list')
          if (!userCategoryJson) return this.addError('RequestInputValidationErrorType')
          const userCategory = JSON.parse(userCategoryJson)
          Object.values(userCategory).flat().forEach(user => {
            allUserIds.push(user.userId)
            allUserEmails.push(user.email)
          })
        } else {
          const userArr = typeof users === 'string' ? JSON.parse(users) : users
          if (Array.isArray(userArr)) {
            userArr.forEach(user => {
              allUserIds.push(user.userId)
              allUserEmails.push(user.email)
            })
          }
        }

        if (!allUserIds.length) return this.addError('UserNotExistsErrorType')
        if (!allUserEmails.length) return this.addError('UserEmailNotExistErrorType')

        let bonusStartDate = null
        let bonusEndDate = null
        if (createFreeSpin?.daysValidity) {
          const now = new Date()
          const day = +createFreeSpin?.daysValidity
          bonusStartDate = now
          bonusEndDate = new Date(now.getTime() + day * 24 * 60 * 60 * 1000)
        }

        // user get free-spin here:
        const bonusObj = {
          freeSpinId: createFreeSpin?.freeSpinId,
          bonusId: +isBonusExist?.bonusId,
          bonusType: BONUS_TYPE.FREE_SPIN_BONUS,
          status: BONUS_STATUS.PENDING,
          freeSpinsQty: +freeSpinRound,
          freeSpinAmount: +freeSpinAmount,
          validFrom: freeSpinStartDate || bonusStartDate, // start Date
          expireAt: freeSpinEndDate || bonusEndDate, // end date,
          claimedAt: null,
          games: {
            masterCasinoGameId: isGameExist?.masterCasinoGameId,
            gameName: isGameExist?.gameName,
            gameIdentifier: isGameExist?.gameIdentifier,
            masterCasinoProviderId: isGameExist?.masterCasinoProviderId,
            providerName: isGameExist?.providerName,
            masterGameAggregatorId: isGameExist?.masterGameAggregatorId,
            aggregatorName: isGameExist?.aggregatorName
          }
        }
        const bonusRows = allUserIds.map(userId => ({
          ...bonusObj,
          userId: +userId
        }))

        // 1. create free spin bonus with pending status
        const chunkSize = 5000
        for (let i = 0; i < bonusRows.length; i += chunkSize) {
          const bonusChunk = bonusRows.slice(i, i + chunkSize)
          await UserBonusModel.bulkCreate(bonusChunk, { transaction })
        }

        if (isNotifyUser) {
          // check email templateId is exist or not here
          const isTemplateExist = await EmailTemplatesModel.findOne({
            where: {
              emailTemplateId: +emailTemplateId,
              isActive: true
            }
          })
          if (!isTemplateExist) return this.addError('EmailTemplateNotExistErrorType')

          const emailChunkSize = 500

          if (isNotifyUser && emailTemplateId) {
            for (let i = 0; i < allUserEmails.length; i += emailChunkSize) {
              const userEmailChunk = allUserEmails.slice(i, i + emailChunkSize)
              await notifyUserByEmailJobScheduler({
                usersEmail: userEmailChunk,
                emailTemplateId: +emailTemplateId,
                freeSpinId: createFreeSpin?.createFreeSpin
              })
            }
          }
        }
        //  delete all user status category from redis
        await removeData('user-status-freeSpin-user-list')
      }

      if (freeSpinStartDate !== null && freeSpinEndDate !== null) {
        statusUpdateJobScheduler('POST', 'freeSpin', +createFreeSpin?.freeSpinId)
      }

      return { message: SUCCESS_MSG.CREATE_SUCCESS }
    } catch (error) {
      console.log('Error in CreateFeeSpinGrantSpinService', error)
      return this.addError('InternalServerErrorType', error)
    }
  }
}
