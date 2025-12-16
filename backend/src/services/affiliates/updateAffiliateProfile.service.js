import db from '../../db/models'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { updateEntity, getOne } from '../../utils/crud'


export class UpdateProfileAffiliatedUsersService extends ServiceBase {

  async run () {
    const {
        req: {
            affiliate: { detail : affiliate},
        },
        dbModels: {
          Affiliate: AffiliateModel,
        },
        sequelizeTransaction :transaction
      } = this.context

      const {
        firstName,
        lastName,
        dateOfBirth,
        gender,
        addressLine_1: addressLine1,
        addressLine_2: addressLine2,
        city,
        state,
        country,
        plan,
        trafficSource,
        phone,
        phoneCode,
        zipCode,
        preferredContact
      } = this.args

    try {
       
      const query = { affiliateId:affiliate.affiliateId }
       
      const checkAffiliateExist = await getOne({ model: AffiliateModel, data: query, transaction })
      
      if (!checkAffiliateExist) return this.addError('AffiliatesNotExistErrorType')
     
     const updateObj = {
            firstName: firstName, 
            lastName: lastName,
            gender: gender,
            dateOfBirth: dateOfBirth,
            addressLine_1: addressLine1,
            addressLine_2: addressLine2,
            city: city,
            state: state,
            country: country,
            zipCode: zipCode,
            preferredContact,
      }
       if(phone) updateObj.phone = phone
       if(phoneCode) updateObj.phoneCode = phoneCode
       if(plan) updateObj.plan = plan
       if(trafficSource) updateObj.trafficSource = trafficSource

      const updateAffiliateData = await updateEntity({
        model: AffiliateModel,
        values: query,
        data: updateObj,
        transaction: transaction
      })
      if(updateAffiliateData)
      return { data:updateObj, message: SUCCESS_MSG.UPDATE_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
