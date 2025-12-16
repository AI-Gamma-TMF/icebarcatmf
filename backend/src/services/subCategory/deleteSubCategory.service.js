import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import ajv from '../../libs/ajv'
import { deleteEntity, getOne } from '../../utils/crud'
import { deleteSubCategoryKeys, refreshMaterializedView } from '../../utils/common'

const schema = {
  type: 'object',
  properties: {
    masterGameSubCategoryId: {
      type: 'number'
    }
  },
  required: ['masterGameSubCategoryId']
}

const constraints = ajv.compile(schema)

export class DeleteSubCategory extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      dbModels: {
        MasterGameSubCategory: MasterGameSubCategoryModel,
        GameSubCategory: GameSubcategoryModel
      },
      sequelizeTransaction: transaction
    } = this.context
    const { masterGameSubCategoryId } = this.args

    const isSubCategoryExist = await getOne({
      model: MasterGameSubCategoryModel,
      data: { masterGameSubCategoryId },
      attributes: ['isActive'],
      transaction
    })
    if (!isSubCategoryExist) {
      return (this.addError('GameSubCategoryNotExistsErrorType'))
    }

    await deleteEntity({
      model: GameSubcategoryModel,
      values: { masterGameSubCategoryId },
      transaction
    })
    await deleteEntity({
      model: MasterGameSubCategoryModel,
      values: { masterGameSubCategoryId },
      transaction
    })

    await Promise.all([deleteSubCategoryKeys(), refreshMaterializedView(transaction)])

    return { success: true, message: SUCCESS_MSG.DELETE_SUCCESS }
  }
}
