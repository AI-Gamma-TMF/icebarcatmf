import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { KYC_STATUS, ROLE, ROLE_MAP } from '../../utils/constants/constant'

const schema = {
  type: 'object',
  properties: {
    user: { type: 'object' },
    userId: { type: 'number' },
    kycLevel: { type: 'string' },
    reason: { type: 'string' },
    favorite: { type: 'boolean' }
  },
  required: ['userId', 'kycLevel']
}

const constraints = ajv.compile(schema)

export class UpdateUserKyc extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      dbModels: { User: UserModel, ActivityLog: ActivityLogModel },
      sequelizeTransaction: transaction
    } = this.context

    let updateValues = {}
    let kycLevelChange = ''
    const { user, userId, kycLevel, reason, favorite } = this.args

    try {
      const userExist = await UserModel.findOne({
        attributes: ['userId', 'uniqueId', 'kycStatus', 'email', 'phone', 'phoneCode'],
        where: {
          userId
        }
      })

      if (!userExist) return this.addError('UserNotExistsErrorType')
      //  email verified and kyc-update K1
      if (kycLevel === KYC_STATUS.ACCOUNT_EMAIL_VERIFIED && !userExist.isEmailVerified) {
        if (!(userExist.email)) return this.addError('UserEmailNotExistErrorType')
        updateValues = {
          ...updateValues,
          isEmailVerified: true,
          kycStatus: userExist.kycStatus === KYC_STATUS.ACCOUNT_KYC_VERIFIED ? KYC_STATUS.ACCOUNT_KYC_VERIFIED : KYC_STATUS.ACCOUNT_EMAIL_VERIFIED
        }
        kycLevelChange = userExist.kycStatus === KYC_STATUS.ACCOUNT_KYC_VERIFIED ? KYC_STATUS.ACCOUNT_KYC_VERIFIED : KYC_STATUS.ACCOUNT_EMAIL_VERIFIED
      }
      //  phone verified and kyc-update K3
      if (kycLevel === KYC_STATUS.ACCOUNT_VERIFIED_PHONE && !userExist.phoneVerified) {
        if (!(userExist.phone && userExist.phoneCode)) return this.addError('UserPhoneNoNotExistErrorType')
        updateValues = {
          ...updateValues,
          phoneVerified: true,
          kycStatus: userExist.kycStatus === KYC_STATUS.ACCOUNT_KYC_VERIFIED ? KYC_STATUS.ACCOUNT_KYC_VERIFIED : KYC_STATUS.ACCOUNT_VERIFIED_PHONE
        }
        kycLevelChange = userExist.kycStatus === KYC_STATUS.ACCOUNT_KYC_VERIFIED ? KYC_STATUS.ACCOUNT_KYC_VERIFIED : KYC_STATUS.ACCOUNT_VERIFIED_PHONE
      }

      //  User Account-verified and kyc-update K4
      if (kycLevel === KYC_STATUS.ACCOUNT_KYC_VERIFIED && userExist.kycStatus !== KYC_STATUS.ACCOUNT_KYC_VERIFIED) {
        updateValues = {
          ...updateValues,
          kycStatus: KYC_STATUS.ACCOUNT_KYC_VERIFIED,
          sumsubKycStatus: 'completed'
        }
        kycLevelChange = KYC_STATUS.ACCOUNT_KYC_VERIFIED
      }

      await UserModel.update(updateValues, {
        where: {
          uniqueId: userExist.uniqueId,
          userId: userExist.userId
        },
        transaction
      })
      const { adminUserId, firstName, lastName, email, roleId } = user
      await ActivityLogModel.create(
        {
          actioneeId: adminUserId,
          actioneeType: ROLE_MAP[roleId] || ROLE.ADMIN,
          remark: reason,
          fieldChanged: 'kycStatus',
          originalValue: userExist.kycStatus,
          changedValue: kycLevelChange,
          userId,
          moreDetails: { adminDetails: { adminUserId, firstName, lastName, email, roleId }, favorite: favorite || false }
        },
        {
          transaction
        }
      )

      return { message: SUCCESS_MSG.UPDATE_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
