import { sequelize } from '../../db/models'
import ServiceBase from '../../libs/serviceBase'
import { pageValidation } from '../../utils/common'
import { SUCCESS_MSG } from '../../utils/constants/success'

export class GetAllCRMPromocodeService extends ServiceBase {
  async run () {
    let where = 'crm_promocode = false AND deleted_at IS NULL'

    let { promocodeSearch, pageNo, limit, promotionType, orderBy, sortBy } = this.args

    orderBy = orderBy === 'promocode' ? 'promocode' : `promocode, ${orderBy || 'created_at'}`

    const { page, size } = pageValidation(pageNo, limit)
    if (promocodeSearch) where += ` AND (promocode ILIKE '%${promocodeSearch}%')`

    if (promotionType) where += ` AND promotion_type = '${promotionType}'`

    const pagination = `LIMIT ${size} OFFSET ${(page - 1) * size}`

    const [[{ count }], rows] = await Promise.all([
      sequelize.query(
        `SELECT COUNT(DISTINCT(promocode)) AS count FROM crm_promotions WHERE ${where}`,
        { type: sequelize.QueryTypes.SELECT }
      ),
      sequelize.query(
        `SELECT DISTINCT ON (promocode)
          promocode,
          name,
          promotion_type AS "promotionType"
        FROM
          crm_promotions
        WHERE ${where} 
        ORDER BY ${orderBy} ${sortBy || 'DESC'}
        ${pagination};`,
        { type: sequelize.QueryTypes.SELECT }
      )
    ])

    return {
      success: true,
      message: SUCCESS_MSG.GET_SUCCESS,
      details: {
        count, rows
      }
    }
  }
}
