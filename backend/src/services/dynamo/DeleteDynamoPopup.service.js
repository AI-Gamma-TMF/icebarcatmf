import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'

export class DeleteDynamoPopup extends ServiceBase {
  get constraints () {
    return {
      popupId: {
        presence: { allowEmpty: false }
      }
    }
  }

  async run () {
    const { popupId } = this.args
    const { Popup: PopupModel } = this.context.dbModels
    const transaction = this.context.sequelizeTransaction

    const popup = await PopupModel.findOne({ where: { id: popupId } })
    if (!popup) {
      return this.addError('PopupNotFoundError')
    }

    await PopupModel.destroy({ where: { id: popupId }, transaction })

    return { message: SUCCESS_MSG.DELETE_SUCCESS, success: true }
  }
}
