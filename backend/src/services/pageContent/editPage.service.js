import { Op } from 'sequelize'

import db from '../../db/models'
import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { getOne, updateEntity } from '../../utils/crud'

const schema = {
  type: 'object',
  properties: {
    pageId: {
      type: 'string',
      pattern: '^[0-9]+$'
    },
    pageName: { type: 'string' }
  },
  required: ['pageId', 'pageName']
}

const constraints = ajv.compile(schema)

export class EditPageService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { pageId, pageName } = this.args
    const transaction = this.context.sequelizeTransaction

    try {
      const checkPageExists = await getOne({
        model: db.PageContent,
        data: { pageId: pageId }
      })

      if (!checkPageExists) return this.addError('PageNotFoundErrorType')

      const updatedPage = await updateEntity({
        model: db.PageContent,
        values: { pageId },
        data: { pageName: pageName},
        transaction
      })

      return { pageId: updatedPage, message: SUCCESS_MSG.UPDATE_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
