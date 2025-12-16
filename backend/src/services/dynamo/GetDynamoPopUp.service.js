import ServiceBase from '../../libs/serviceBase'
import { Op } from 'sequelize'
import ajv from '../../libs/ajv'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { calculateUTCDateRangeForTimezoneRange, pageValidation, prepareImageUrl } from '../../utils/common'

const schema = {
  type: 'object',
  properties: {
    popupId: { type: ['string', 'null'] },
    isActive: { type: ['string', 'null'] },
    fromDate: { type: ['string', 'null'] },
    toDate: { type: ['string', 'null'] },
    pageNo: { type: ['string', 'null'] },
    limit: { type: ['string', 'null'] },
    search: { type: ['string', 'null'] },
    timezone: { type: ['string', 'null'] }
  }
}
const constraints = ajv.compile(schema)

export class GetDynamoPopups extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { Popup: PopupModel } = this.context.dbModels
    let { popupId, fromDate, toDate, pageNo, limit, search, isActive = 'all', timezone = 'PST' } = this.args

    try {
      if (popupId) {
        const popup = await PopupModel.findOne({
          where: { id: popupId }
        })

        if (!popup) {
          return this.addError('NotFoundErrorType', 'Popup not found')
        }

        const popupData = popup.toJSON()
        popupData.imageUrl = prepareImageUrl(popupData.imageUrl)

        return {
          message: SUCCESS_MSG.GET_SUCCESS,
          success: true,
          data: popupData
        }
      }

      const whereClause = { popupType: { [Op.eq]: 'dynamo' } }

      if (isActive !== 'all') {
        whereClause.isActive = isActive === 'true'
      }

      if (fromDate || toDate) {
        const result = calculateUTCDateRangeForTimezoneRange(fromDate, toDate, timezone)
        fromDate = result?.startDateUTC
        toDate = result?.endDateUTC
      
        if (fromDate) {
          whereClause.startDate = whereClause.startDate || {}
          whereClause.startDate[Op.gte] = fromDate
        }
        if (toDate) {
          whereClause.endDate = whereClause.endDate || {}
          whereClause.endDate[Op.lte] = toDate
        }
      }      

      if (search) {
        whereClause[Op.or] = [
          { popupName: { [Op.iLike]: `%${search}%` } },
          { description: { [Op.iLike]: `%${search}%` } }
        ]
      }

      const { page, size } = pageValidation(pageNo, limit)

      const data = await PopupModel.findAndCountAll({
        where: whereClause,
        order: [['startDate', 'DESC']],
        limit: size,
        offset: (page - 1) * size
      })

      const rowsWithImageUrls = data.rows.map(popup => {
        const popupData = popup.toJSON()
        popupData.imageUrl = prepareImageUrl(popupData.imageUrl)
        return popupData
      })

      return {
        message: SUCCESS_MSG.GET_SUCCESS,
        success: true,
        data: {
          count: data.count,
          rows: rowsWithImageUrls
        }
      }
    } catch (error) {
      console.error('GetDynamoPopups Error:', error)
      return this.addError('InternalServerErrorType', error)
    }
  }
}
