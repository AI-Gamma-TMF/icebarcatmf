import db from '../../db/models'
import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import config from '../../configs/app.config'
import { uploadFile, validateFile } from '../../utils/common'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { createNewEntity, updateEntity, getOne } from '../../utils/crud'
import { OK, LOGICAL_ENTITY, PAGE_ASSET_TYPE } from '../../utils/constants/constant'

const schema = {
  type: 'object',
  properties: {
    pageId: { 
      type: 'string',
      pattern: '^[0-9]+$' 
    },
    assetType: {
      type: 'string',
      enum: [PAGE_ASSET_TYPE.TEXT, PAGE_ASSET_TYPE.DIGITAL, PAGE_ASSET_TYPE.MESSAGE]
    },
    assetKey: { type: 'string', pattern: '^[a-zA-Z]([\\w-]*[a-zA-Z0-9])?$'},
    assetValue: { type: ['string', 'object'] }
  },
  required: ['pageId', 'assetType', 'assetKey']
}

const constraints = ajv.compile(schema)

export class  AddNewPageAsset extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { pageId, assetType, assetKey, assetValue } = this.args
    const {
      req: {
        file: digitalAsset
      }
    } = this.context

    const fileCheckResponse = validateFile(null, digitalAsset)

    if(fileCheckResponse === OK && assetType != PAGE_ASSET_TYPE.DIGITAL) return this.addError('InvalidAssetValueErrorType')
    else if(fileCheckResponse != OK && assetType === PAGE_ASSET_TYPE.DIGITAL) return this.addError('InvalidAssetValueErrorType')
    else if(assetType != PAGE_ASSET_TYPE.DIGITAL && !assetValue) return this.addError('InvalidAssetValueErrorType')

    const transaction = this.context.sequelizeTransaction
    try {
      const {dataValues : { assets: assetsList }} = await getOne({ model: db.PageContent, data: { pageId }, attributes: ['assets'], transaction })
      let newAssetsList = {}
      if(assetsList !== null) {
        const allAssetKeys = Object.keys(assetsList)
        if(allAssetKeys.includes(assetKey)) {
          return this.addError('AssetKeyAlreadyExistErrorType')
        }
        newAssetsList = assetsList
      }
      // if (checkProviderExists) return this.addError('CasinoProviderExistsErrorType')
      
      if(assetType === PAGE_ASSET_TYPE.DIGITAL) {
        if (fileCheckResponse === OK) {
          if (digitalAsset && typeof (digitalAsset) === 'object') {
            const fileName = `${config.get('env')}/assets/${LOGICAL_ENTITY.DIGITAL_ASSET}/${pageId}-${Date.now()}.${digitalAsset.mimetype.split('/')[1]}`
            await uploadFile(digitalAsset, fileName)

            const dataObj = {}
            dataObj[`${assetKey}`] = {
              assetKey,
              assetValue: fileName,
              assetType
            }
            newAssetsList = { ...dataObj, ...newAssetsList }
            await updateEntity({
              model: db.PageContent,
              values: { pageId },
              data: { assets: newAssetsList },
              transaction
            })
            return { success: true, message: SUCCESS_MSG.CREATE_SUCCESS }
          }
        }
      } else {
        const dataObj = {}
        dataObj[`${assetKey}`] = {
          assetKey,
          assetValue,
          assetType
        }
        newAssetsList = { ...dataObj, ...newAssetsList }
        await updateEntity({
          model: db.PageContent,
          values: { pageId },
          data: { assets: newAssetsList },
          transaction
        })
      return { success: true, message: SUCCESS_MSG.CREATE_SUCCESS }
      }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
