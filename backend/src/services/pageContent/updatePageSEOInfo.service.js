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
      type: 'number',
      // pattern: '^[0-9]+$' 
    },
    title: { type: 'string'},
    description: { type: 'string'},
    keywords: { type: 'string'}
  },
  required: ['pageId', 'title', 'description', 'keywords']
}

const constraints = ajv.compile(schema)

export class UpdatePageSEOInfo extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { pageId, title, description, keywords } = this.args

    console.log(pageId, title, description, keywords)
    const updatedDetails = {
      title: title,
      description: description,
      keywords: keywords
    }

    try {
      await updateEntity({
        model: db.PageContent,
        values: { pageId },
        data: { seoDetails: updatedDetails },
      })
      return { message: SUCCESS_MSG.GET_SUCCESS }
    } catch (error) {
      console.log(error)
      this.addError('InternalServerErrorType', error)
    }
  }
}
