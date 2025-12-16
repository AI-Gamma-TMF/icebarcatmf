import ServiceBase from '../../libs/serviceBase'
import { getUserTierDetails } from '../../utils/common'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { Op } from 'sequelize'

export class GetEmailCenterUserDetailsService extends ServiceBase {
  async run () {
    const {
      dbModels: { User: UserModel, Wallet: WalletModel }
    } = this.context

    const {
      idSearch,
      emailSearch,
      userNameSearch
    } = this.args
    try {
      let query = {}
      if (idSearch) query = { userId: +idSearch }
      if (emailSearch) query = { ...query, email: { [Op.iLike]: `%${emailSearch}%` } }
      if (userNameSearch) query = { ...query, username: { [Op.iLike]: `%${userNameSearch}%` } }

      const user = await UserModel.findOne({
        where: query,
        attributes: [
          'userId',
          'email',
          'firstName',
          'isActive',
          'kycStatus',
          'lastName',
          'username',
          'kycApplicantId',
          'createdAt',
          'currencyCode',
          'countryCode',
          'lastLoginDate',
          'authUrl',
          'authEnable',
          'isBan',
          'isRestrict',
          'isInternalUser',
          'reasonId'
        ],
        include: [
          {
            model: WalletModel,
            as: 'userWallet',
            attributes: [
              'scCoin',
              'totalScCoin',
              'gcCoin'
            ]
          }
        ]
      })

      // add tier details:
      user.dataValues.tierDetails = await getUserTierDetails(user?.userId)

      return { user, success: true, message: SUCCESS_MSG.GET_SUCCESS }
    } catch (error) {
      console.log('ERROR OCCUR IN GET EMAIL CENTER TEMPLATE')
      return this.addError('InternalServerErrorType', error)
    }
  }
}
