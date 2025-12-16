import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'

const schema = {
  type: 'object',
  properties: {
    affiliateId: { type: 'string' }
  }
}

const constraints = ajv.compile(schema)


export  class DeleteAffiliateService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      dbModels: {  
        Affiliate: AffiliateModel
    },
      sequelizeTransaction: transaction
    } = this.context

    const { affiliateId } = this.args

     try {
        const affiliate = await AffiliateModel.findOne({
            where: { affiliateId },
            transaction
          })
      
          if (!affiliate) {
            return this.addError('AffiliatesNotExistErrorType')
          }
      
          await AffiliateModel.destroy({
            where: { affiliateId },
            paranoid: true,
            cascade: true,
            transaction
          })
      
         
         return { message: SUCCESS_MSG.DELETE_SUCCESS }
     } catch (error) {
        this.addError('InternalServerErrorType', error)
     }
  }
}
