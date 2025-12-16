import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { generateRandomAlphaNumericCodes } from '../../utils/common'

export class GenerateRandomPromoCodeService extends ServiceBase {
  async run () {
    const {
      dbModels: { PromotionCode: PromotionCodeModel }
    } = this.context
    try {
      const existingPromoCodes = (await PromotionCodeModel.findAll({ attributes: ['promocode'] })).map(x => { return x.promocode })

      const newPromoCodes = await generateRandomAlphaNumericCodes(1, 8, existingPromoCodes)
      return {
        success: true,
        message: SUCCESS_MSG.CREATE_SUCCESS,
        promoCode: newPromoCodes[0]
      }
    } catch (error) {
      console.log('Error while generating random promo code', error)
      return this.addError('InternalServerErrorType')
    }
  }
}
