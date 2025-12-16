import jwt from 'jsonwebtoken'
import ServiceBase from '../../libs/serviceBase'
import config from '../../configs/app.config'
import { encryptPassword, comparePassword, validatePassword } from '../../utils/common'

export class SetPasswordService extends ServiceBase {
  async run () {
    const {
        dbModels: {
            Affiliate: AffiliateModel,
          },
      sequelizeTransaction: transaction
    } = this.context

    const { token,password } = this.args

    const verifyEmailData = jwt.verify(token, config.get('jwt.emailTokenKey'))

    if (!verifyEmailData) return this.addError('VerifyEmailTokenErrorType')

    const AffiliateData = await AffiliateModel.findOne({
      attributes: [
        'affiliateId',
        'affiliateCode',
        'firstName',
        'isEmailVerified',
        'email',
        'password'
      ],
      where: {
        email: verifyEmailData.email
      },
      transaction
    })

    if (!AffiliateData) return this.addError('AffiliatesNotExistErrorType')

    if (AffiliateData.isEmailVerified)
      return this.addError('EmailAlreadyVerifiedErrorType')

   let encryptedPassword
    if(!AffiliateData.password){
         
        if (!validatePassword(password)) {
          return this.addError('PasswordValidationFailedError')
        }
        encryptedPassword = encryptPassword(password) 
    }  

    await AffiliateModel.update(
      {
        isEmailVerified: true,
        emailToken: null,
        password : encryptedPassword
      },
      {
        where: {
          email: verifyEmailData.email,
        },
        transaction
      }
    )

    return {
      success: true,
      message: 'Password is Set Successfully !'
    }
  }
}
