import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import ajv from '../../libs/ajv'

const schema = {
  type: 'object',
  properties: {
    whaleAssignment: { type: ['boolean', 'null'] }
  },
  required: []
}

const constraints = ajv.compile(schema)
export class UpdateVipAssignmentService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { sequelizeTransaction: transaction, sequelize } = this.context
    const { whaleAssignment } = this.args
    const batchSize = 50000
    let offset = 0
    let inserted = 0
    const startDate = '2025-05-15 00:00:00+00' // could be dynamic arg if needed

    try {
      if (whaleAssignment) {
        // Fetch all userId and managedBy mappings
        const [userInternalRatings] = await sequelize.query(
        `
          SELECT user_id, managed_by
          FROM public.user_internal_rating
          WHERE managed_by = 595 
        `,
        { transaction }
        ) // assign only for dakota for now

        // Update WhalePlayers.managedBy for each user
        for (const record of userInternalRatings) {
          await sequelize.query(
          `
            UPDATE public.whale_players
            SET managed_by = :managedBy
            WHERE user_id = :userId
          `,
          {
            replacements: {
              managedBy: record.managed_by,
              userId: record.user_id
            },
            transaction
          }
          )
        }
        return { success: true, message: SUCCESS_MSG.UPDATE_SUCCESS }
      } else {
        while (true) {
          try {
            const [results] = await sequelize.query(
            `
            INSERT INTO vip_manager_assignments (user_id, manager_id, start_date, end_date, created_at, updated_at)
            SELECT user_id, managed_by, :start_date, NULL, NOW(), NOW()
            FROM user_internal_rating
            WHERE managed_by IS NOT NULL
            AND NOT EXISTS (
            SELECT 1 FROM vip_manager_assignments vma
            WHERE vma.user_id = user_internal_rating.user_id
            AND vma.manager_id = user_internal_rating.managed_by
            AND vma.start_date = :start_date)
            ORDER BY user_id
            LIMIT :batch_size OFFSET :offset
            RETURNING user_id
            `,
            {
              replacements: { start_date: startDate, batch_size: batchSize, offset },
              transaction
            }
            )

            if (results.length === 0) break // no more rows left
            inserted += results.length
            offset += batchSize

            console.log(`✅ Inserted batch of ${results.length}, total so far: ${inserted}`)
          } catch (err) {
            console.log(err)
            throw err
          }
        }
        return { success: true, message: SUCCESS_MSG.UPDATE_SUCCESS, totalInserted: inserted }
      }
    } catch (error) {
      return this.addError('InternalServerErrorType', error.message || error)
    }
  }
}
