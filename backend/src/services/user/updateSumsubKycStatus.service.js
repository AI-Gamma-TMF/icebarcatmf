import axios from 'axios'
import crypto from 'crypto'
import config from '../../configs/app.config'
import ServiceBase from '../../libs/serviceBase'
import { KYC_STATUS } from '../../utils/constants/constant'
import { SUCCESS_MSG } from '../../utils/constants/success'

export class UpdateSumsubKycStatus extends ServiceBase {
  async run () {
    const {
      dbModels: { User: UserModel },
      sequelizeTransaction: transaction
    } = this.context

    const { userId, idArray } = this.args

    if (idArray) {
      await Promise.all(idArray.map(userId => {
        return UpdateSumsubKycStatus.execute({ userId }, this.context)
      }))
      return {
        success: true,
        message: SUCCESS_MSG.UPDATE_SUCCESS
      }
    }

    const userData = await UserModel.findOne({
      where: {
        userId
      },
      transaction
    })

    if (!(userData && userData?.kycApplicantId)) return this.addError('KycApplicantDoesNotExistsErrorType')

    const url = `/resources/applicants/${userData?.kycApplicantId}/reset`
    const timeStamp = Math.floor(Date.now() / 1000)
    const sign = crypto.createHmac('sha256', config.get('sumSub.secret'))
    sign.update(timeStamp + 'POST' + url)

    const options = {
      method: 'POST',
      url: `${config.get('sumSub.url')}${url}`,
      headers: {
        'X-App-Token': config.get('sumSub.token'),
        'X-App-Access-Sig': sign.digest('hex'),
        Accept: 'application/json',
        'X-App-Access-Ts': `${timeStamp}`
      }
    }

    try {
      await axios(options)
    } catch (error) {
      console.log(error)
      return this.addError('InternalServerErrorType')
    }
    const updateData = {
      sumsubKycStatus: 'init'
    }
    if (userData.firstName && userData.lastName && userData.gender && userData.addressLine_1 && userData.addressLine_2 && userData.city && userData.state && userData.countryCode && userData.zipCode) {
      updateData.kycStatus = KYC_STATUS.ACCOUNT_PROFILE_COMPLETED
    } else {
      updateData.kycStatus = KYC_STATUS.ACCOUNT_EMAIL_VERIFIED
    }

    await UserModel.update(updateData, { where: { userId: userData.userId }, ...transaction })

    return {
      success: true,
      message: SUCCESS_MSG.UPDATE_SUCCESS
    }
  }
}
