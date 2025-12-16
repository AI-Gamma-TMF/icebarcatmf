import { sequelize } from '../../../db/models'
import { Op, Sequelize } from 'sequelize'
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

export class UpdateFreeSpinBonusService extends ServiceBase {
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
      freeSpinId,
      providerId,
      title,
      masterCasinoGameId,
      isUserUploadCsv,
      users,
      freeSpinAmount,
      freeSpinRound,
      startDate = null,
      endDate = null,
      coinType,
      isNotifyUser,
      freeSpinType,
      emailTemplateId,
      daysValidity
    } = this.args

    try {
      const freeSpinExist = await FreeSpinBonusGrantModel.findOne({
        where: { freeSpinId },
        transaction,
        raw: true
      })

      if (!freeSpinExist) return this.addError('FreeSpinBonusNotExistErrorType')

      startDate = startDate && startDate.trim() !== '' ? startDate : null
      endDate = endDate && endDate.trim() !== '' ? endDate : null

      if (startDate && endDate) {
        if (freeSpinExist?.endDate < new Date() || [FREE_SPINS_STATUS.COMPLETED, FREE_SPINS_STATUS.CANCELLED, FREE_SPINS_STATUS.EXPIRED].includes(+freeSpinExist?.status)) {
          return this.addError('FreeSpinAlreadyFinishedErrorType')
        }
      }

      const currentDate = new Date()
      let freeSpinStartDate = null
      let freeSpinEndDate = null

      if (startDate && endDate) {
        const updatedStartDate = new Date(startDate)
        const updatedEndDate = new Date(endDate)

        if (
          isDateValid(updatedStartDate) &&
          isDateValid(updatedEndDate) &&
          updatedEndDate > currentDate &&
          updatedStartDate <= updatedEndDate &&
          +freeSpinExist.status === FREE_SPINS_STATUS.UPCOMING
        ) {
          freeSpinStartDate = updatedStartDate
          freeSpinEndDate = updatedEndDate
        } else {
          return this.addError('InvalidDateErrorType')
        }
      } else if (startDate) {
        const updatedStartDate = new Date(startDate)
        if (
          !isDateValid(updatedStartDate) ||
          updatedStartDate < currentDate ||
          updatedStartDate > freeSpinExist?.endDate
        ) {
          return this.addError('InvalidDateErrorType')
        } else if (+freeSpinExist?.status === FREE_SPINS_STATUS.RUNNING) {
          return this.addError('FreeSpinIsRunningStartDateErrorType')
        } else {
          freeSpinStartDate = updatedStartDate
        }
      } else if (endDate) {
        const updatedEndDate = new Date(endDate)

        if (
          !isDateValid(updatedEndDate) ||
          updatedEndDate < currentDate ||
          freeSpinExist?.startDate > updatedEndDate
        ) {
          return this.addError('InvalidDateErrorType')
        } else {
          freeSpinEndDate = updatedEndDate
        }
      }

      let bonusStartDate = null
      let bonusEndDate = null
      if (!(startDate || endDate) && (+freeSpinExist.daysValidity > 0)) {
        daysValidity = +freeSpinExist.daysValidity || 3
        const now = new Date()
        bonusStartDate = now
        bonusEndDate = new Date(now.getTime() + +freeSpinExist.daysValidity * 24 * 60 * 60 * 1000)
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

      // Updating title
      if (title) {
        const isTitleExist = await FreeSpinBonusGrantModel.findOne({
          where: {
            [Op.and]: [
              Sequelize.where(
                Sequelize.fn('LOWER', Sequelize.col('title')),
                title.trim().toLowerCase()
              )
            ],
            freeSpinId: { [Op.notIn]: [freeSpinExist?.freeSpinId] }
          }
        })

        if (isTitleExist) {
          return this.addError('FreeSpinWithSameTitleAlreadyExistErrorType')
        }
      }

      const rawQuery = `SELECT
                        master_casino_game_id AS "masterCasinoGameId",
                        game_name AS "gameName",
                        game_identifier AS "gameIdentifier",
                        provider_id AS "masterCasinoProviderId",
                        provider_name AS "providerName",
                        aggregator_id AS "masterGameAggregatorId",
                        aggregator_name AS "aggregatorName"
                        FROM
                         public.game_data_view where master_casino_game_id = :masterCasinoGameId and provider_id = :providerId`

      const [isGameExist] = await sequelize.query(rawQuery, {
        type: sequelize.QueryTypes.SELECT,
        replacements: {
          masterCasinoGameId: +masterCasinoGameId || +freeSpinExist?.masterCasinoGameId,
          providerId: +providerId || +freeSpinExist?.providerId
        },
        transaction
      })

      if (!isGameExist) {
        return this.addError('CasinoGameNotExistsErrorType')
      }

      const rawUpdateObj = {
        providerId,
        title,
        masterCasinoGameId,
        freeSpinAmount,
        freeSpinRound,
        coinType,
        isNotifyUser,
        freeSpinType,
        startDate: freeSpinStartDate,
        endDate: freeSpinEndDate,
        daysValidity: daysValidity
      }

      const updateObj = Object.fromEntries(
        Object.entries(rawUpdateObj).filter(([_, value]) => value !== undefined && value !== null)
      )

      if (emailTemplateId) {
        updateObj.moreDetails = { ...freeSpinExist?.moreDetails, emailTemplateId }
      }

      // Check if bonus-affecting fields changed
      const affectsBonus = ['freeSpinAmount', 'freeSpinRound', 'masterCasinoGameId', 'providerId', 'startDate', 'endDate', 'daysValidity']
      const userBonusUpdateNeeded = affectsBonus.some(field => this.args[field] !== undefined && this.args[field] !== freeSpinExist[field])

      await FreeSpinBonusGrantModel.update(updateObj, {
        where: { freeSpinId },
        transaction
      })

      // Update user bonus if needed
      if (userBonusUpdateNeeded) {
        const userBonusUpdateFields = {
          freeSpinsQty: +freeSpinRound || +freeSpinExist?.freeSpinRound,
          freeSpinAmount: +freeSpinAmount || +freeSpinExist?.freeSpinAmount,
          validFrom: freeSpinStartDate || bonusStartDate || freeSpinExist?.startDate,
          expireAt: freeSpinEndDate || bonusEndDate || freeSpinExist?.endDate,
          claimedAt: null,
          games: isGameExist || freeSpinExist?.games
        }

        await UserBonusModel.update(userBonusUpdateFields, {
          where: {
            freeSpinId,
            bonusType: BONUS_TYPE.FREE_SPIN_BONUS,
            status: BONUS_STATUS.PENDING
          },
          transaction
        })
      }

      if (freeSpinExist?.freeSpinType === FREE_SPIN_TYPE.DIRECT_GRANT && (isUserUploadCsv || users?.length > 0)) {
        const userIdEmailMap = new Map()
        // 1. check user for grant
        if (isUserUploadCsv) {
          const userCategoryJson = await getCachedData('user-status-freeSpin-user-list')
          if (!userCategoryJson) return this.addError('RequestInputValidationErrorType')
          const userCategory = JSON.parse(userCategoryJson)
          const flatUsers = Object.values(userCategory).flat()
          flatUsers.forEach(user => userIdEmailMap.set(user.userId, user.email))
          users = flatUsers
        } else if (users) {
          const userArr = typeof users === 'string' ? JSON.parse(users) : users
          if (Array.isArray(userArr)) {
            users = userArr
            userArr.forEach(user => userIdEmailMap.set(user.userId, user.email))
          }
        }

        const newUserIds = Array.from(userIdEmailMap.keys())
        if (!newUserIds.length) return this.addError('UserNotExistsErrorType')

        // here working for update user csv
        if (isUserUploadCsv || users.length > 0) {
          const existingUserBonuses = await UserBonusModel.findAll({
            attributes: ['userId'],
            where: {
              freeSpinId,
              bonusType: BONUS_TYPE.FREE_SPIN_BONUS
            },
            transaction,
            raw: true
          })
          const existingUserIds = existingUserBonuses.map(u => u.userId)
          const newUserSet = new Set(newUserIds)
          const existingUserSet = new Set(existingUserIds)
          // To insert: in new CSV but not in DB

          const userIdsToInsert = newUserIds.filter(id => !existingUserSet.has(id))
          const userEmailsToSent = isNotifyUser ? userIdsToInsert.map(userId => userIdEmailMap.get(userId)).filter(Boolean) : []
          // To mark as INVALID: in DB but not in new CSV
          const userIdsToInvalidate = existingUserIds.filter(id => !newUserSet.has(id))

          // creating userBonus for new user :
          const bonusObj = {
            freeSpinId: +freeSpinId,
            bonusId: +isBonusExist?.bonusId,
            bonusType: BONUS_TYPE.FREE_SPIN_BONUS,
            status: BONUS_STATUS.PENDING,
            freeSpinsQty: +freeSpinRound || freeSpinExist?.freeSpinRound,
            freeSpinAmount: +freeSpinAmount || freeSpinExist?.freeSpinAmount,
            validFrom: freeSpinStartDate || freeSpinExist?.startDate || bonusStartDate,
            expireAt: freeSpinEndDate || freeSpinExist?.endDate || bonusEndDate,
            claimedAt: null,
            games: isGameExist || freeSpinExist.games
          }

          // insert record of new user
          if (userIdsToInsert.length > 0) {
            const bonusRows = userIdsToInsert.map(userId => ({
              ...bonusObj,
              userId: +userId
            }))
            const chunkSize = 5000
            for (let i = 0; i < bonusRows.length; i += chunkSize) {
              const bonusChunk = bonusRows.slice(i, i + chunkSize)
              await UserBonusModel.bulkCreate(bonusChunk, { transaction })
            }
          }

          // mark the existing user canceled which not exist in new csv user list
          if (isUserUploadCsv && userIdsToInvalidate.length > 0) {
            await UserBonusModel.update({
              status: BONUS_STATUS.CANCELLED
            }, {
              where: {
                freeSpinId,
                userId: userIdsToInvalidate,
                bonusType: BONUS_TYPE.FREE_SPIN_BONUS,
                status: BONUS_STATUS.PENDING
              },
              transaction
            })
          }

          // work to notify new user if true
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
              for (let i = 0; i < userEmailsToSent.length; i += emailChunkSize) {
                const userEmailChunk = userEmailsToSent.slice(i, i + emailChunkSize)
                await notifyUserByEmailJobScheduler({
                  usersEmail: userEmailChunk,
                  emailTemplateId: +emailTemplateId,
                  freeSpinId: +freeSpinId
                })
              }
            }
          }
        }

        if (isUserUploadCsv) {
          //  delete all user status category from redis
          await removeData('user-status-freeSpin-user-list')
        }
      }

      // trigger job when date update
      if (freeSpinStartDate || freeSpinEndDate) {
        statusUpdateJobScheduler('PUT', 'freeSpin', +freeSpinExist?.freeSpinId)
      }

      return { message: SUCCESS_MSG.UPDATE_SUCCESS }
    } catch (error) {
      console.log('Error Occur in UpdateFreeSpinBonusService', error)
      return this.addError('InternalServerErrorType', error)
    }
  }
}
