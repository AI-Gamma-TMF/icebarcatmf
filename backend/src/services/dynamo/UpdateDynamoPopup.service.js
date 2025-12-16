import config from '../../configs/app.config'
import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import { convertToWebPAndUpload } from '../../utils/common'
import { UPLOAD_FILE_SIZE } from '../../utils/constants/constant'
import { SUCCESS_MSG } from '../../utils/constants/success'

const schemaObject = {
  type: 'object',
  properties: {
    popupId: { type: 'string' },
    popupName: { type: 'string' },
    startDate: { type: 'string' },
    endDate: { type: 'string' },
    description: { type: 'string' },
    link: { type: 'string' },
    imageUrl: { type: 'string' },
    isActive: {
      type: 'boolean',
      enum: [true, false]
    },
    file: {
      type: ['object', 'null']
    }
  },
  required: ['popupId']
}

const constraints = ajv.compile(schemaObject)

export class UpdateDynamoPopup extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { popupId, popupName, startDate, endDate, description, link, isActive } = this.args

    const file = this.context.req.file
    const {
      dbModels: { Popup: PopupModel },
      sequelizeTransaction: transaction
    } = this.context

    try {
      const popup = await PopupModel.findByPk(popupId)
      if (!popup) {
        return this.addError('PopupNotFoundErrorType')
      }

      let imageUrl = this.args.imageUrl || popup.imageUrl

      if (file) {
        const isValid = this.validateFile(null, file)
        if (isValid !== 'OK') {
          return this.addError('FileTypeNotSupportedErrorType')
        }

        let fileName = `${config.get('env')}/assets/popups/${popupName}-${Date.now()}.webp`.replace(/\s+/g, '')
        fileName = fileName.split(' ').join('')
        await convertToWebPAndUpload(file, fileName)
        imageUrl = fileName
      }

      await popup.update(
        {
          popupName: popupName ?? popup.popupName,
          startDate: startDate ?? popup.startDate,
          endDate: endDate ?? popup.endDate,
          description: description ?? popup.description,
          link: link ?? popup.link,
          imageUrl,
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

  validateFile = (res, file) => {
    if (!file) {
      return 'FileNotFoundErrorType'
    }

    if (file.size > UPLOAD_FILE_SIZE) {
      return 'FileSizeTooLargeErrorType'
    }

    const supportedMimeTypes = [
      'image/png',
      'image/jpeg',
      'image/jpg',
      'image/tiff',
      'image/webp',
      'image/svg+xml',
      'application/pdf'
    ]

    if (!supportedMimeTypes.includes(file.mimetype)) {
      return 'FileTypeNotSupportedErrorType'
    }

    return 'OK'
  }
}
