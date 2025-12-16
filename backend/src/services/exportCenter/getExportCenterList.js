import { Op } from 'sequelize'
import ajv from '../../libs/ajv'
import db from '../../db/models'
import config from '../../configs/app.config'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { calculateUTCDateRangeForTimezoneRange, pageValidation } from '../../utils/common'

const s3Config = config.getProperties().s3

const schema = {
  type: 'object',
  properties: {
    type: { type: ['string', 'null'] },
    startDate: { type: ['string', 'null'] },
    endDate: { type: ['string', 'null'] },
    limit: { type: ['string', 'null'] },
    orderBy: { type: ['string', 'null'] },
    sortBy: { type: ['string', 'null'] },
    pageNo: { type: ['string', 'null'] },
    status: { type: ['string', 'null'] },
    timezone: { type: 'string' }
  }
}
const constraints = ajv.compile(schema)

export class GetExportCenterListService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    let { pageNo, limit, orderBy, sortBy, startDate, endDate, type, status, timezone } = this.args
    const where = {}
    try {
      const { page, size } = pageValidation(pageNo, limit)

      if (startDate || endDate) {
        const result = calculateUTCDateRangeForTimezoneRange(startDate, endDate, timezone)
        startDate = result?.startDateUTC
        endDate = result?.endDateUTC
      }
      const offset = (page - 1) * size
      const { id } = this.context.req.body
      if (id) where.adminUserId = id
      if (type) where.type = type // Add the `type` condition
      if (startDate && endDate) {
        where.createdAt = {
          [Op.gte]: startDate, // "greater than or equal to"
          [Op.lte]: endDate // "less than or equal to"
        }
      }
      if (status && status !== 'all') where.status = status // Add the `status` condition
      // Fetch data1
      const exportsList = await db.ExportCenter.findAndCountAll({
        where: {
          ...where,
          parentExportId: null // Fetch only parent records (where parentExportId is null)
        },
        attributes: ['id', 'type', 'status', 'isActive', 'url', 'createdAt', 'updatedAt', 'parentExportId'],
        include: [
          {
            model: db.ExportCenter,
            as: 'childExports',
            attributes: ['id', 'type', 'status', 'url', 'createdAt', 'updatedAt', 'parentExportId']
          }
        ],
        distinct: true,
        order: [[orderBy || 'createdAt', sortBy || 'DESC']],
        limit: limit || 15,
        offset
      })
      exportsList.rows.forEach((element) => {
        const urlsArray = []
        if (element.url && element.url.indexOf('https://') === -1) element.url = `${s3Config.S3_DOMAIN_KEY_PREFIX}${element.url}`
        urlsArray.push(element.url)
        // Process child URLs
        if (element.childExports && element.childExports.length > 0) {
          element.childExports.forEach((child) => {
            if (child.url && child.url.indexOf('https://') === -1) child.url = `${s3Config.S3_DOMAIN_KEY_PREFIX}${child.url}`
            urlsArray.push(child.url)
          })
        }
        element.dataValues.urlsArray = urlsArray
      })
      return {
        exportsList: {
          rows: exportsList
        },
        message: SUCCESS_MSG.GET_SUCCESS
      }
    } catch (error) {
      return this.addError('InternalServerErrorType', error)
    }
  }
}
