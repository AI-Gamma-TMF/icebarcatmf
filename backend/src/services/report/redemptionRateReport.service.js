import { Op } from 'sequelize'
import { sequelize } from '../../db/models'
import ServiceBase from '../../libs/serviceBase'
import { CSV_TYPE } from '../../utils/constants/constant'
import { exportCenterAxiosCall } from '../../utils/common'
import { SUCCESS_MSG } from '../../utils/constants/success'

export class RedemptionRateReportService extends ServiceBase {
  async run () {
    const {
      dbModels: {
        ExportCenter: ExportCenterModel,
        RedemptionRateReport: RedemptionRateReportModel
      }
    } = this.context

    let { startDate, endDate, orderBy, sort, csvDownload } = this.args
    try {
      if (!startDate && !endDate) {
        const today = new Date()

        const lastWeek = new Date()
        lastWeek.setDate(today.getDate() - 7)// subtract 7 days

        startDate = this.formatDate(lastWeek)
        endDate = this.formatDate(today)
      }

      const query = {
        date: {
          [Op.between]: [startDate, endDate]
        }
      }

      if (csvDownload === 'true') {
        const transaction = await sequelize.transaction()
        try {
          const { id } = this.context.req.body

          const exportTbl = await ExportCenterModel.create({ type: CSV_TYPE.REDEMPTION_RATE_REPORT_CSV, adminUserId: id, payload: this.args }, { transaction })

          const axiosBody = {
            exportId: exportTbl.id,
            startDate,
            endDate,
            orderBy: orderBy,
            type: CSV_TYPE.REDEMPTION_RATE_REPORT_CSV,
            sort: sort
          }

          await exportCenterAxiosCall(axiosBody)

          await transaction.commit()
          return { message: SUCCESS_MSG.CSV_DOWNLOAD_SUCCESS }
        } catch (error) {
          await transaction.rollback()
          return this.addError('InternalServerErrorType', error)
        }
      }

      const { count, rows } = await RedemptionRateReportModel.findAndCountAll({
        where: query,
        attributes: ['date', 'revenue', 'redemptions', 'pendingRedemptions', 'inProcessRedemptions', 'totalRevenue', 'totalRedemptions', 'totalPendingRedemptions', 'totalInprocessRedemptions', 'redemptionsRate', 'lifetimeRedemptionsRate'],
        order: [[orderBy || 'date', sort || 'ASC']]
      })
      return { success: true, rows, count }
    } catch (error) {
      console.log('RedemptionRateReport Error:', error)
      return this.addError('InternalServerErrorType', error)
    }
  }

  async formatDate (date) {
    return date.toISOString().split('T')[0]// format function YYYY-MM-DD
  }
}
