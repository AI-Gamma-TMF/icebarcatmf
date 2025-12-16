import { Op } from 'sequelize'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import db, { sequelize } from '../../db/models'
import { CSV_TYPE } from '../../utils/constants/constant'
import { exportCenterAxiosCall, pageValidation } from '../../utils/common'

export class MervReportService extends ServiceBase {
  async run () {
    const { startDate, endDate, csvDownload, order = 'ASC', pageNo, limit } = this.args
    const { dbModels: { MervReport: MervReportModel } } = this.context

    let start, end

    if (startDate && endDate) {
      start = new Date(startDate)
      end = new Date(endDate)
    } else {
      const reference = new Date()
      reference.setHours(0, 0, 0, 0)
      reference.setDate(reference.getDate() - 1)

      end = reference
      start = new Date(reference)
      start.setDate(end.getDate() - 6)
    }

    start.setHours(0, 0, 0, 0)
    end.setHours(0, 0, 0, 0)

    // CSV download path
    if (csvDownload === 'true') {
      const transaction = await sequelize.transaction()
      try {
        const { id } = this.context.req.body
        const exportTbl = await db.ExportCenter.create(
          { type: CSV_TYPE.MERV_REPORT_CSV, adminUserId: id, payload: this.args },
          { transaction }
        )

        const axiosBody = {
          startDate,
          endDate,
          orderBy: order,
          exportId: exportTbl.dataValues.id,
          exportType: exportTbl.dataValues.type,
          type: CSV_TYPE.MERV_REPORT_CSV
        }

        await exportCenterAxiosCall(axiosBody)
        await transaction.commit()
        return { message: SUCCESS_MSG.CSV_DOWNLOAD_SUCCESS }
      } catch (error) {
        await transaction.rollback()
        return this.addError('InternalServerErrorType', error)
      }
    }

    try {
      const { page, size } = pageValidation(pageNo, limit)

      const { count, rows } = await MervReportModel.findAndCountAll({
        where: {
          date: {
            [Op.gte]: start,
            [Op.lte]: end
          }
        },
        order: [['date', order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC']],
        limit: size,
        offset: (page - 1) * size
      })

      const rowsWithDayNames = rows.map(row => {
        const plain = row.get({ plain: true })
        const dateObj = new Date(plain.date + 'T00:00:00-08:00')
        const dayName = dateObj.toLocaleDateString('en-US', {
          weekday: 'long',
          timeZone: 'America/Los_Angeles'
        })
        const data = { ...plain, ...plain.bonusData, dayName }
        delete data.bonusData
        return data
      })

      return {
        success: true,
        data: {
          count,
          rows: rowsWithDayNames
        }
      }
    } catch (error) {
      console.log('MervReportService Error:', error)
      return this.addError('InternalServerErrorType', error)
    }
  }
}
