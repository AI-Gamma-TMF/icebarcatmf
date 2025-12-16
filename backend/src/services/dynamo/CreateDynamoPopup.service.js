import config from '../../configs/app.config'
import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import { convertToWebPAndUpload } from '../../utils/common'
import { UPLOAD_FILE_SIZE } from '../../utils/constants/constant'
import { SUCCESS_MSG } from '../../utils/constants/success'

const schemaObject = {
  type: 'object',
  properties: {
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
      type: ['object']
    }
  },
  required: ['popupName', 'startDate', 'description', 'isActive', 'link']
}

const constraints = ajv.compile(schemaObject)

export class CreateDynamoPopup extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      popupName,
      startDate,
      endDate,
      description,
      link,
      isActive
    } = this.args

    const file = this.context.req.file
    const { Popup: PopupModel } = this.context.dbModels
    const transaction = this.context.sequelizeTransaction

    let imageUrl = this.args.imageUrl || null

    // Validate and upload file if provided
    if (file) {
      const isValid = this.validateFile(null, file)
      if (isValid !== 'OK') {
        return this.addError('FileTypeNotSupportedErrorType')
      }

      let fileName = `${config.get('env')}/assets/popups/${popupName}-${Date.now()}.webp`.replace(/\s+/g, '')
      fileName = fileName.split(' ').join('')

      await convertToWebPAndUpload(file, fileName)
      imageUrl = fileName
      console.log('fileName generated:', fileName)
    }

    const popupObj = {
      popupName,
      startDate,
      endDate,
      description,
      link,
      imageUrl,
      isActive,
      popupType: 'dynamo'
    }

    await PopupModel.create(popupObj, { transaction })

    return { message: SUCCESS_MSG.CREATE_SUCCESS, success: true }
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
