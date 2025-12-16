import db, { sequelize } from '../../db/models'
import { Op, fn, literal } from 'sequelize'
import ServiceBase from '../../libs/serviceBase'
import { pageValidation, exportCenterAxiosCall } from '../../utils/common'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { CSV_TYPE } from '../../utils/constants/constant'

export class GetUsersWithVaultCoinsService extends ServiceBase {
  async run () {
    const { email, pageNo, limit, sortBy, order, username, csvDownload, filterBy, operator, value } = this.args

    let userQuery = {}
    try {
      const { page, size } = pageValidation(pageNo, limit)
      if (email) {
        userQuery = {
          ...userQuery,
          email: { [Op.iLike]: `%${email.toLowerCase().trim()}%` }
        }
      }
      if (username) {
        userQuery = {
          ...userQuery,
          username: { [Op.iLike]: `%${username.trim()}%` }
        }
      }

      let exportId = null
      let exportType = null

      const payload = { email, pageNo, limit, sortBy, order, username, csvDownload }

      if (csvDownload === 'true') {
        const transaction = await sequelize.transaction()
        try {
          const { id } = this.context.req.body
          // Adding a table in Db called export center
          const exportTbl = await db.ExportCenter.create(
            { type: CSV_TYPE.VAULT_DATA_CSV, adminUserId: id, payload: payload },
            { transaction }
          )
          exportId = exportTbl.dataValues.id
          exportType = exportTbl.dataValues.type

          const axiosBody = {
            limit: limit || 15,
            pageNo: pageNo || 1,
            order: order || '',
            sortBy: sortBy || '',
            username: username || '',
            csvDownload: csvDownload || '',
            filterBy,
            operator,
            value,
            exportId: exportId,
            exportType: exportType,
            type: CSV_TYPE.VAULT_DATA_CSV
          }
          // Hitting CSV Download API
          await exportCenterAxiosCall(axiosBody)
          await transaction.commit()
          return { message: SUCCESS_MSG.CSV_DOWNLOAD_SUCCESS }
        } catch (error) {
          await transaction.rollback()
          return this.addError('InternalServerErrorType', error)
        }
      }
      const userDetails = await this.fetchData({ offset: (page - 1) * size, limit: size, userQuery, sortBy, order, filterBy, operator, value })
      const vaultDetails = {
        rows: userDetails.rows,
        count: userDetails.count.length
      }
      return { vaultDetails, message: SUCCESS_MSG.GET_SUCCESS }
    } catch (error) {
      return this.addError('InternalServerErrorType', error)
    }
  }

  async fetchData ({ offset, limit, userQuery, sortBy, order, filterBy, operator, value }) {
    const havingConditions = [
      literal(`
        SUM(
          COALESCE(CAST(vault_sc_coin->>'bsc' AS NUMERIC), 0) +
          COALESCE(CAST(vault_sc_coin->>'psc' AS NUMERIC), 0) +
          COALESCE(CAST(vault_sc_coin->>'wsc' AS NUMERIC), 0)
        ) > 0 OR vault_gc_coin > 0
      `)
    ]

    if (filterBy && operator && value !== undefined) {
      if (filterBy && filterBy === 'vaultGcCoin') {
        havingConditions.push(
          literal(`vault_gc_coin ${operator} ${parseFloat(value)}`)
        )
      }

      if (filterBy && filterBy === 'vaultScCoin') {
        havingConditions.push(
          literal(`
            SUM(
              COALESCE(CAST(vault_sc_coin->>'bsc' AS NUMERIC), 0) +
              COALESCE(CAST(vault_sc_coin->>'psc' AS NUMERIC), 0) +
              COALESCE(CAST(vault_sc_coin->>'wsc' AS NUMERIC), 0)
            ) ${operator} ${parseFloat(value)}
          `)
        )
      }
    }
    const results = await db.Wallet.findAndCountAll({
      attributes: [
        'ownerId',
        [
          fn(
            'SUM',
            literal(`
              COALESCE(CAST(vault_sc_coin->>'bsc' AS NUMERIC), 0) +
              COALESCE(CAST(vault_sc_coin->>'psc' AS NUMERIC), 0) +
              COALESCE(CAST(vault_sc_coin->>'wsc' AS NUMERIC), 0)
            `)
          ),
          'total_vault_sc_coin'
        ],
        'vault_gc_coin'
      ],
      include: [
        {
          model: db.User,
          attributes: ['username', 'email'],
          where: userQuery
        }
      ],
      group: [
        'Wallet.owner_id',
        'User.username',
        'User.email',
        'Wallet.vault_gc_coin'
      ],
      having: {
        [Op.and]: havingConditions
      },
      limit,
      offset,
      order: [[literal(sortBy || 'total_vault_sc_coin'), order || 'DESC']],
      raw: true,
      nest: true
    })

    return results
  }
}
