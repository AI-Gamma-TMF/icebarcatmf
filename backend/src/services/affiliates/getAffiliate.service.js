import { Op } from 'sequelize'
import ServiceBase from '../../libs/serviceBase'
import { pageValidation } from '../../utils/common'
import { SUCCESS_MSG } from '../../utils/constants/success'

export class GetAffiliatesService extends ServiceBase {
  async run () {
    const {
        dbModels: {
            Affiliate: AffiliateModel
        },
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

    try {
      let query 
      const { page, size } = pageValidation(pageNo, limit)

      if (idSearch) query = { affiliateId: +idSearch }
       // email must be come in encodeURIComponent() format
      if (emailSearch)
        query = { ...query, email: { [Op.iLike]: `%${emailSearch}%` } }
      if (firstNameSearch)
        query = { ...query, firstName: { [Op.iLike]: `%${firstNameSearch}%` } }
      if (lastNameSearch)
        query = { ...query, lastName: { [Op.iLike]: `%${lastNameSearch}%` } }
      if (phoneSearch)
        query = { ...query, phone: { [Op.iLike]: `%${phoneSearch}%` } }

      const Affiliate = await AffiliateModel.findAndCountAll({
        where: query,
        order: [[orderBy || 'createdAt', sort || 'DESC']],
        limit: size,
        offset: (page - 1) * size,
        attributes: [
          'affiliateId',
          'email',
          'firstName',
          'lastName',
          'isActive'
        ]
      })

      return Affiliate
        ? { data:Affiliate, message: SUCCESS_MSG.GET_SUCCESS }
        : this.addError('AffiliatesNotExistErrorType')
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
