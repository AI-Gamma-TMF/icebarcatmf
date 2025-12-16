import db from '../../db/models'
import ServiceBase from '../../libs/serviceBase'
import { ERRORS } from '../../utils/constants/errors'

export class GetVipQuestionnaireFormulaValuesService extends ServiceBase {
  async run () {
    try {
      const getConfig = await db.GlobalSetting.findAll({
        attributes: ['value', 'key'],
        raw: true,
        where: {
          key: ['VIP_QUESTIONNAIRE_MIN_BONUS', 'VIP_QUESTIONNAIRE_MAX_BONUS', 'VIP_QUESTIONNAIRE_NGR_MULTIPLIER']
        }
      })
      return { config: getConfig }
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error)
    }
  }
}
