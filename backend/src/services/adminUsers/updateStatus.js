import db from '../../db/models'
import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { updateEntity, getOne, createNewEntity } from '../../utils/crud'
import { BONUS_TYPE, ROLE, TOGGLE_CASE, TRANSACTION_STATUS } from '../../utils/constants/constant'
import { RedeemRequestActionService } from '../payment/redeemRequestAction'
import { cancelledEnabledFreeSpinJobScheduler, deleteSubCategoryKeys, refreshMaterializedView, removeData } from '../../utils/common'
const schema = {
  type: 'object',
  properties: {
    adminId: { type: 'number' },
    cmsPageId: { type: 'number' },
    masterCasinoProviderId: { type: 'number' },
    code: {
      type: 'string'
    },
    status: {
      type: 'boolean'
    },
    userType: { type: 'string' },
    masterGameSubCategoryId: { type: 'number' },
    masterCasinoGameId: { type: 'number' },
    bonusId: { type: 'number' },
    userId: { type: 'number' },
    pageBannerId: { type: 'number' },
    reason: { type: 'string' },
    favorite: { type: ['boolean', 'null'] },
    masterGameAggregatorId: { type: 'number' },
    freeSpinAllowed: { type: ['boolean', 'null'] }
  },
  required: ['code', 'status', 'userType']
}

const constraints = ajv.compile(schema)

export class UpdateStatusService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async checkExist ({ model, data, include = undefined }) {
    const checkExist = await getOne({ model, data, include })
    if (!checkExist) return false
    return true
  }

  async run () {
    const {
      userType,
      code,
      status,
      cmsPageId,
      masterCasinoProviderId,
      adminId,
      masterGameSubCategoryId,
      masterCasinoGameId,
      bonusId,
      userId,
      pageBannerId,
      reason,
      favorite,
      masterGameAggregatorId,
      freeSpinAllowed
    } = this.args

    let model, values, updatedValue
    let data = { isActive: status }
    const adminDetail = this.context.req.body.user
    const { sequelizeTransaction: transaction } = this.context
    try {
      switch (code) {
        case TOGGLE_CASE.ADMIN : {
          if (userType !== ROLE.ADMIN) return this.addError('ActionNotAllowedErrorType')
          if (!adminId) return this.addError('IdRequiredErrorType')
          if (!await this.checkExist({ model: db.AdminUser, data: { adminUserId: adminId } })) {
            return this.addError('AdminNotFoundErrorType')
          }
          if (adminId === 1) return this.addError('ActionNotAllowedErrorType')

          model = db.AdminUser
          values = { adminUserId: adminId }
          break
        }
        case TOGGLE_CASE.CMS: {
          if (!cmsPageId) return this.addError('IdRequiredErrorType')
          if (!await this.checkExist({ model: db.CmsPage, data: { cmsPageId } })) {
            return this.addError('CmsNotFoundErrorType')
          }
          model = db.CmsPage
          values = { cmsPageId }
          break
        }
        case TOGGLE_CASE.CASINO_PROVIDER: {
          if (!masterCasinoProviderId) return this.addError('IdRequiredErrorType')
          if (!await this.checkExist({ model: db.MasterCasinoProvider, data: { masterCasinoProviderId } })) {
            return this.addError('CasinoProviderNotFoundErrorType')
          }
          model = db.MasterCasinoProvider
          values = { masterCasinoProviderId }

          // disable provider
          if (status === false && freeSpinAllowed === true) {
            // trigger the job for change the status cancelled
            cancelledEnabledFreeSpinJobScheduler({
              entityType: TOGGLE_CASE.FREE_SPIN_PROVIDER,
              entityId: masterCasinoProviderId,
              status: false
            })
          }
          break
        }
        case TOGGLE_CASE.CASINO_SUB_CATEGORY: {
          if (!masterGameSubCategoryId) return this.addError('IdRequiredErrorType')
          if (!await this.checkExist({ model: db.MasterGameSubCategory, data: { masterGameSubCategoryId } })) {
            return this.addError('GameSubCategoryNotExistsErrorType')
          }
          model = db.MasterGameSubCategory
          values = { masterGameSubCategoryId }
          break
        }
        case TOGGLE_CASE.CATEGORY_GAME: {
          if (!masterCasinoGameId) return this.addError('IdRequiredErrorType')
          if (!await this.checkExist({ model: db.MasterCasinoGame, data: { masterCasinoGameId } })) {
            return this.addError('CasinoGameNotExistsErrorType')
          }
          model = db.MasterCasinoGame
          values = { masterCasinoGameId }

          // disable game
          if (status === false && freeSpinAllowed === true) {
            cancelledEnabledFreeSpinJobScheduler({
              entityType: TOGGLE_CASE.FREE_SPIN_GAME,
              entityId: masterCasinoGameId,
              status: false
            })
          }
          break
        }
        case TOGGLE_CASE.BONUS: {
          if (!bonusId) return this.addError('IdRequiredErrorType')
          if (!await this.checkExist({ model: db.Bonus, data: { bonusId } })) {
            return this.addError('BonusNotExistErrorType')
          }
          await removeData('bonus-data')
          model = db.Bonus
          values = { bonusId }
          break
        }
        // working-User
        case TOGGLE_CASE.USER: {
          if (!userId) return this.addError('IdRequiredErrorType')
          if (!await this.checkExist({ model: db.User, data: { userId } })) {
            return this.addError('UserNotExistErrorType')
          }
          model = db.User
          values = { userId }
          const { adminUserId, firstName, lastName, email, roleId } = adminDetail
          await createNewEntity({
            model: db.ActivityLog,
            data: {
              actioneeId: adminDetail.adminUserId,
              actioneeType: ROLE.ADMIN,
              remark: reason,
              userId,
              fieldChanged: 'isActive',
              originalValue: !!status,
              changedValue: !!status,
              moreDetails: { adminDetails: { adminUserId, firstName, lastName, email, roleId }, favorite: favorite || false }
            },
            transaction
          })

          const getPendingRedeemRequests = await db.WithdrawRequest.findAll({
            where: {
              userId,
              status: TRANSACTION_STATUS.PENDING
            }
          })

          await Promise.all(getPendingRedeemRequests.map(async withdrawRequest => {
            await RedeemRequestActionService.execute({ reason: 'User is disabled', status: 'rejected', userId, withdrawRequestId: withdrawRequest.withdrawRequestId }, this.context)
          }))
          break
        }
        case TOGGLE_CASE.USER_EMAIL: {
          if (!userId) return this.addError('IdRequiredErrorType')
          if (!await this.checkExist({ model: db.User, data: { userId } })) {
            return this.addError('UserNotExistErrorType')
          }
          model = db.User
          values = { userId }
          data = { isEmailVerified: status }
          break
        }
        case TOGGLE_CASE.BANNER: {
          if (!pageBannerId) return this.addError('IdRequiredErrorType')
          if (!await this.checkExist({ model: db.PageBanner, data: { pageBannerId } })) {
            return this.addError('BannerNotFoundErrorType')
          }
          await removeData('bannerData')
          model = db.PageBanner
          values = { pageBannerId }
          break
        }

        case TOGGLE_CASE.FREE_SPIN_GAME: {
          if (!masterCasinoGameId) return this.addError('IdRequiredErrorType')
          if (!await this.checkExist({ model: db.MasterCasinoGame, data: { masterCasinoGameId } })) {
            return this.addError('CasinoGameNotExistsErrorType')
          }
          model = db.MasterCasinoGame
          values = { masterCasinoGameId }
          data = { adminEnabledFreespin: status }

          // disable case
          if (status === false) {
            cancelledEnabledFreeSpinJobScheduler({
              entityType: TOGGLE_CASE.FREE_SPIN_GAME,
              entityId: masterCasinoGameId,
              status: false
            })
          }
          break
        }
        case TOGGLE_CASE.FREE_SPIN_PROVIDER: {
          if (!masterCasinoProviderId) return this.addError('IdRequiredErrorType')
          if (!await this.checkExist({ model: db.MasterCasinoProvider, data: { masterCasinoProviderId } })) {
            return this.addError('CasinoProviderNotFoundErrorType')
          }
          model = db.MasterCasinoProvider
          values = { masterCasinoProviderId }
          data = { adminEnabledFreespin: status }

          // disable case
          if (status === false) {
            cancelledEnabledFreeSpinJobScheduler({
              entityType: TOGGLE_CASE.FREE_SPIN_PROVIDER,
              entityId: masterCasinoProviderId,
              status: false
            })
          }
          break
        }
        case TOGGLE_CASE.FREE_SPIN_AGGREGATOR: {
          if (!masterGameAggregatorId) return this.addError('IdRequiredErrorType')
          if (!await this.checkExist({ model: db.MasterGameAggregator, data: { masterGameAggregatorId } })) {
            return this.addError('CasinoProviderNotFoundErrorType')
          }
          model = db.MasterGameAggregator
          values = { masterGameAggregatorId }
          data = { adminEnabledFreespin: status }

          if (status === false) {
            cancelledEnabledFreeSpinJobScheduler({
              entityType: TOGGLE_CASE.FREE_SPIN_AGGREGATOR,
              entityId: masterGameAggregatorId,
              status: false
            })
          }
          break
        }

        default: {
          return this.addError('ToggleCaseInvalidErrorType')
        }
      }

      if (code === TOGGLE_CASE.BONUS) {
        const checkExist = await getOne({ model, data: { bonusId } })
        await removeData('bonus-data')
        if (checkExist.bonusType === BONUS_TYPE.DAILY_BONUS || checkExist.bonusType === 'monthly bonus') {
          values = { bonusType: checkExist.bonusType }
          updatedValue = await updateEntity({ model, values, data })
        } else {
          updatedValue = await updateEntity({ model, values, data })
        }
      } else {
        updatedValue = await updateEntity({ model, values, data })
      }

      if (code === TOGGLE_CASE.CASINO_PROVIDER || code === TOGGLE_CASE.CASINO_CATEGORY || code === TOGGLE_CASE.CATEGORY_GAME || code === TOGGLE_CASE.CASINO_SUB_CATEGORY) {
        await Promise.all([deleteSubCategoryKeys(), refreshMaterializedView(transaction)])
      }

      return { success: Boolean(updatedValue), message: SUCCESS_MSG.STATUS_UPDATED }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
