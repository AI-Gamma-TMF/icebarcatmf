import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { pageValidation } from '../../utils/common'
import { Op } from 'sequelize'
export class GetAffiliatedUsersService extends ServiceBase {
  async run () {
    const {
      req: {
        affiliate: { detail }
      },
      dbModels: { User: UserModel },
      sequelizeTransaction
    } = this.context

    const {
      limit,
      pageNo,
      idSearch,
      emailSearch,
      firstNameSearch,
      lastNameSearch,
      phoneSearch,
      orderBy,
      sort
    } = this.args

    const affiliateCode = detail.affiliateCode
    let query, affiliateUsers
    try {
      if (idSearch) query = { userId: +idSearch }
      // email must be come in encodeURIComponent() format
      if (emailSearch)
        query = { ...query, email: { [Op.iLike]: `%${emailSearch}%` } }
      if (firstNameSearch)
        query = { ...query, firstName: { [Op.iLike]: `%${firstNameSearch}%` } }
      if (lastNameSearch)
        query = { ...query, lastName: { [Op.iLike]: `%${lastNameSearch}%` } }
      if (phoneSearch)
        query = { ...query, phone: { [Op.iLike]: `%${phoneSearch}%` } }

      const { page, size } = pageValidation(pageNo, limit)

      affiliateUsers = await UserModel.findAndCountAll({
        where: {
          ...query,
          affiliateCode: { [Op.eq]: affiliateCode }
        },
        limit: size,
        offset: (page - 1) * size,
        order: [[orderBy || 'userId', sort || 'DESC']],
        attributes: [
          'userId',
          'username',
          'email',
          'isActive',
          'createdAt',
          'firstName',
          'lastName',
          'phone',
          'lastLoginDate'
        ],
        transaction: sequelizeTransaction
      })
      if (!affiliateUsers) {
        return this.addError('AffiliateNotExistsErrorType')
      }
      return {
        data: affiliateUsers,
        message: SUCCESS_MSG.GET_SUCCESS
      }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
