import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'

const schemaObject = {
  type: 'object',
  properties: {
    popupId: { type: 'string' },
    isActive: {
      type: 'boolean',
      enum: [true, false]
    }
  },
  required: ['popupId', 'isActive']
}

const constraints = ajv.compile(schemaObject)

export class PatchDynamoPopup extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { popupId, isActive } = this.args

    const {
      dbModels: { Popup: PopupModel },
      sequelizeTransaction: transaction
    } = this.context

    try {
      const popup = await PopupModel.findByPk(popupId)
      if (!popup) {
        return this.addError('PopupNotFoundErrorType')
      }

      await popup.update(
        {
          isActive: typeof isActive === 'boolean' ? isActive : popup.isActive
        },
        { transaction }
      )

      return { message: SUCCESS_MSG.UPDATE_SUCCESS, success: true }
    } catch (error) {
      console.log(error)
      return this.addError('InternalServerErrorType', error)
    }
  }
}
