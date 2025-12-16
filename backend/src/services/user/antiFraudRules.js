import db, { Sequelize } from '../../db/models'
import ServiceBase from '../../libs/serviceBase'
import ajv from '../../libs/ajv'
import { Op } from 'sequelize'

const schema = {
  type: 'object',
  properties: {
    activity: { type: 'string' },
    search: { type: ['string', 'null'] }
  },
  required: []
}
const constraints = ajv.compile(schema)

export class AntiFraudRulesService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const { activity, search } = this.args
      const whereCondition = {}

      whereCondition.isDeleted = false

      if (activity) {
        whereCondition.activity = activity
      }

      if (search) {
        whereCondition.ruleName = { [Op.iLike]: `%${search}%` }
      }

      const antiFraudRules = await db.antiFraudRules.findAll({
        where: whereCondition,
        attributes: [
          'antiFraudRuleId',
          'ruleName',
          'activity',
          'isActive',
          [Sequelize.literal('"country"."name"'), 'countryName'],
          [Sequelize.literal('"group"."group_name"'), 'groupName']
        ],
        include: [
          {
            model: db.Country,
            as: 'country',
            attributes: []
          },
          {
            model: db.PlayerGroup,
            as: 'group',
            attributes: []
          }
        ]
      })

      return { success: true, antiFraudRules }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
