import { Op } from 'sequelize'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { pageValidation } from '../../utils/common'

export class GetAllAffiliatesService extends ServiceBase {
  async run () {
    const {
      dbModels: { Affiliate: AffiliateModel }
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
    let query, affiliatesDetails

    try {
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

      const { page, size } = pageValidation(pageNo, limit)

      affiliatesDetails = await AffiliateModel.findAndCountAll({
        where: query,
        limit: size,
        offset: (page - 1) * size,
        order: [[orderBy || 'createdAt', sort || 'DESC']],
        attributes: {
          exclude: ['password']
        }
      })

      return affiliatesDetails
        ? { affiliatesDetails, message: SUCCESS_MSG.GET_SUCCESS }
        : this.addError('AffiliatesNotFoundErrorType')
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
