import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import ajv from '../../libs/ajv'
import db from '../../db/models'
import { removeData } from '../../utils/common'

const schema = {
  type: 'object',
  properties: {
    order: {
      type: 'array'
    }
  },
  required: ['order']
}

const constraints = ajv.compile(schema)

export class OrderBannerService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    let { order } = this.args
    const promises = []
    order = [...(new Set(order))]

    const banners = await db.PageBanner.findAndCountAll({
      attributes: ['pageBannerId', 'order']
    })

    if (banners.count !== order.length) return this.addError('OrderInvalidErrorType')

    banners.rows.forEach(async (banner) => {
      if (order.indexOf(banner.pageBannerId) !== -1) {
        promises.push(banner.set({ order: order.indexOf(banner.pageBannerId) + 1 }).save())
      }
    })

    await Promise.all(promises)
    await removeData('bannerData')

    return { success: true, message: SUCCESS_MSG.UPDATE_SUCCESS }
  }
}
