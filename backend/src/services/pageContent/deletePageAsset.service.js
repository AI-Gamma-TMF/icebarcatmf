import db from '../../db/models'
import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import config from '../../configs/app.config'
import { uploadFile, validateFile } from '../../utils/common'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { updateEntity, getOne } from '../../utils/crud'
import { OK, LOGICAL_ENTITY, PAGE_ASSET_TYPE } from '../../utils/constants/constant'

const schema = {
  type: 'object',
  properties: {
    pageId: { 
      type: 'string',
      pattern: '^[0-9]+$' 
    },
    assetKey: { type: 'string', pattern: '^[a-zA-Z]([\\w-]*[a-zA-Z0-9])?$'},
  },
  required: ['pageId', 'assetKey']
}

const constraints = ajv.compile(schema)

export class DeletePageAsset extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { pageId, assetKey } = this.args
    const transaction = this.context.sequelizeTransaction
    try {
      const {dataValues : { assets: assetsList }} = await getOne({ model: db.PageContent, data: { pageId }, attributes: ['assets'], transaction })
      if(assetsList === null) {
        return this.addError('AssetKeyNotFoundErrorType')
      } else {
        const allAssetKeys = Object.keys(assetsList)
        if(!allAssetKeys.includes(assetKey)) {
          return this.addError('AssetKeyNotFoundErrorType')
        }
      }
      let newAssetsList = assetsList
      delete newAssetsList[assetKey]

      await updateEntity({
        model: db.PageContent,
        values: { pageId },
        data: { assets: newAssetsList },
        transaction
      })

      return { success: true, message: SUCCESS_MSG.DELETE_SUCCESS }

    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
