import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { deleteSubCategoryKeys, refreshMaterializedView } from '../../utils/common'
import { sequelize } from '../../db/models'

const schema = {
  type: 'object',
  properties: {
    order: { type: 'array' },
    masterGameSubCategoryId: { type: 'number' }
  },
  required: ['order', 'masterGameSubCategoryId']
}

const constraints = ajv.compile(schema)

export class OrderCategoryGamesService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      sequelizeTransaction: transaction
    } = this.context
    let { order, masterGameSubCategoryId } = this.args
    order = [...(new Set(order))]

    try {
      if (!order.length) {
        return this.addError('OrderInvalidErrorType')
      }

      const cases = []
      const ids = []

      order.forEach((gameSubcategoryId, idx) => {
        const newOrderId = idx + 1
        ids.push(gameSubcategoryId)
        cases.push(`WHEN ${gameSubcategoryId} THEN ${newOrderId}`)
      })

      await sequelize.query(
        `
          UPDATE "game_subcategory"
          SET "order_id" = null
          WHERE "master_game_sub_category_id" = :masterGameSubCategoryId
        `,
        {
          type: sequelize.QueryTypes.UPDATE,
          replacements: { masterGameSubCategoryId },
          transaction
        }
      )

      await sequelize.query(
        `
          UPDATE "game_subcategory"
          SET "order_id" = CASE "game_subcategory_id"
            ${cases.join('\n')}
          END
          WHERE "game_subcategory_id" IN (${ids.join(',')})
            AND "master_game_sub_category_id" = :masterGameSubCategoryId
        `,
        {
          type: sequelize.QueryTypes.UPDATE,
          replacements: { masterGameSubCategoryId },
          transaction
        }
      )

      await Promise.all([deleteSubCategoryKeys(), refreshMaterializedView(transaction)])

      return { success: true, message: SUCCESS_MSG.UPDATE_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
