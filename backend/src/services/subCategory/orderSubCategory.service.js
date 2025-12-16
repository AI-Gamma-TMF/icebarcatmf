import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { deleteSubCategoryKeys, refreshMaterializedView } from '../../utils/common'

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

export class OrderSubCategory extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      dbModels: {
        MasterGameSubCategory: MasterGameSubCategoryModel
      },
      sequelizeTransaction: transaction
    } = this.context
    let { order } = this.args
    const promises = []
    order = [...(new Set(order))]

    const allSubCategories = await MasterGameSubCategoryModel.findAll({
      attributes: ['isActive', 'masterGameSubCategoryId'],
      transaction
    })

    if (allSubCategories.length !== order.length) return this.addError('OrderInvalidErrorType')

    allSubCategories.forEach(async (category) => {
      if (order.indexOf(category.masterGameSubCategoryId) !== -1) {
        promises.push(category.set({ orderId: order.indexOf(category.masterGameSubCategoryId) + 1 }).save())
      }
    })

    await Promise.all(promises)
    await Promise.all([deleteSubCategoryKeys(), refreshMaterializedView(transaction)])

    return { success: true, message: SUCCESS_MSG.UPDATE_SUCCESS }
  }
}
