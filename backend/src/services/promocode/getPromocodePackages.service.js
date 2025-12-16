import { Op } from 'sequelize'
import ServiceBase from '../../libs/serviceBase'
import { pageValidation } from '../../utils/common'
import { SUCCESS_MSG } from '../../utils/constants/success'

export class GetPromocodePackagesService extends ServiceBase {
  async run () {
    const {
      dbModels: { Promocode: PromocodeModel, Package: PackageModel }
    } = this.context

    const { limit, pageNo, promocodeId, isArchive = '', packageId, amount, gcCoin, scCoin, isActive } = this.args

    const { page, size } = pageValidation(pageNo, limit)

    let promocodeExist
    if (isArchive !== '') {
      promocodeExist = await PromocodeModel.findOne({
        where: { promocodeId: +promocodeId, deletedAt: { [Op.not]: null } },
        attributes: ['promocodeId', 'package'],
        paranoid: false,
        raw: true
      })
    } else {
      promocodeExist = await PromocodeModel.findOne({
        where: { promocodeId: +promocodeId },
        attributes: ['promocodeId', 'package'],
        raw: true
      })
    }
    if (!promocodeExist) { return this.addError('PromocodeNotExistErrorType') }
    if (!Array.isArray(promocodeExist.package) || promocodeExist.package.length === 0) {
      return {
        success: true,
        message: SUCCESS_MSG.GET_SUCCESS,
        count: 0,
        packages: []
      }
    }
    let query = {
      packageId: { [Op.in]: promocodeExist.package }
    }
    if (packageId) query = { ...query, packageId: +packageId }
    if (amount) query = { ...query, amount }
    if (gcCoin) query = { ...query, gcCoin: +gcCoin }
    if (scCoin) query = { ...query, scCoin: +scCoin }
    if (isActive && isActive !== 'all') query = { ...query, isActive }
    const detail = await PackageModel.findAndCountAll({
      attributes: ['packageId', 'amount', 'gcCoin', 'scCoin', 'isActive', 'isVisibleInStore', 'validTill'],
      where: query,
      raw: true,
      limit: size,
      offset: (page - 1) * size,
      order: [['createdAt', 'DESC']]
    })

    return {
      success: true,
      message: SUCCESS_MSG.GET_SUCCESS,
      count: detail.count,
      packages: detail.rows
    }
  }
}
