import { Op } from 'sequelize'

import db from '../../db/models'
import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { createNewEntity, getOne } from '../../utils/crud'

const schema = {
  type: 'object',
  properties: {
    pageName: { type: 'string' } // pattern: '^[a-zA-Z]([\w-]*[a-zA-Z0-9])?$'}
  },
  required: ['pageName']
}

const constraints = ajv.compile(schema)

export class AddNewPageService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { pageName } = this.args
    const transaction = this.context.sequelizeTransaction

    try {
      const checkPageExists = await getOne({
        model: db.PageContent,
        data: { pageName: pageName }
      })

      if (checkPageExists) return this.addError('PageAlreadyExistErrorType')

      const page = await createNewEntity({
        model: db.PageContent,
        data: { pageName },
        transaction
      })

      return { pageId: page.pageId, message: SUCCESS_MSG.CREATE_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
