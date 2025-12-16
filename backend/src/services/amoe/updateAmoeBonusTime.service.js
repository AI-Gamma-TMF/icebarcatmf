import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import { setData } from '../../utils/common'
import { SUCCESS_MSG } from '../../utils/constants/success'

const schema = {
  type: 'object',
  properties: {
    amoeBonusTime: { type: 'string' }
  },
  required: ['amoeBonusTime']
}

const constraints = ajv.compile(schema)

export class UpdateAmoeBonusTimeService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      dbModels: {
        GlobalSetting: GlobalSettingModel
      },
      sequelizeTransaction: transaction
    } = this.context
    try {
      const { amoeBonusTime } = this.args

      if (+amoeBonusTime <= 0) return this.addError('InvalidNumberErrorType')

      const updatedAmoeTime = await GlobalSettingModel.update({
        value: amoeBonusTime
      }, { where: { key: 'AMOE_BONUS_TIME' }, transaction })

      await setData('amoe-global-setting-data', JSON.stringify({ AMOE_BONUS_TIME: amoeBonusTime }))

      return { updatedAmoeTime, message: SUCCESS_MSG.GET_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
