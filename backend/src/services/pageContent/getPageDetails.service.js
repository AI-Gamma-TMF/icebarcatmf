import db from '../../db/models'
import ajv from '../../libs/ajv'
import { getOne } from '../../utils/crud'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { PAGE_ASSET_TYPE } from '../../utils/constants/constant'
import config from '../../configs/app.config'

const schema = {
  type: 'object',
  properties: {
    pageId: {
      type: 'string',
      pattern: '^[0-9]+$'
    }
  },
  required: ['pageId']
}

const constraints = ajv.compile(schema)

export class GetPageDetails extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { pageId } = this.args
    let query = { pageId }
    const s3Config = config.getProperties().s3

    try {
      query = { ...query }

      const pageDetails = await getOne({ model: db.PageContent, data: query })
      if (!pageDetails) return this.addError('PageNotFoundErrorType')

      const assets = Object.values(pageDetails.assets || {})
      const textAssets = []
      const digitalAssets = []
      const messages = []
      assets?.forEach((asset) => {
        if(asset.assetType == PAGE_ASSET_TYPE.TEXT) textAssets.push(asset)
        else if(asset.assetType == PAGE_ASSET_TYPE.DIGITAL) {
          const dAsset = { ...asset, assetValue: `${s3Config.S3_DOMAIN_KEY_PREFIX}${asset.assetValue}` }
          digitalAssets.push(dAsset)
        }
        else if(asset.assetType == PAGE_ASSET_TYPE.MESSAGE) messages.push(asset)
      })

      const updatedPageDetails = { 
        pageId: pageDetails.pageId,
        pageName: pageDetails.pageName,
        seoDetails: pageDetails.seoDetails,
        createdAt: pageDetails.createdAt,
        updatedAt: pageDetails.updatedAt,
      }
      delete updatedPageDetails.assets
      updatedPageDetails.textAssets = textAssets
      updatedPageDetails.digitalAssets = digitalAssets
      updatedPageDetails.messages = messages

      return { pageDetails: updatedPageDetails, message: SUCCESS_MSG.GET_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
