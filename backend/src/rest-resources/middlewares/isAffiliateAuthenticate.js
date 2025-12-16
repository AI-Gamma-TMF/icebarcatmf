import db from '../../db/models'
import * as jwt from 'jsonwebtoken'
import config from '../../configs/app.config'
import { UnAuthorizeUserErrorType, AffiliateInActiveErrorType } from '../../utils/constants/errors'

export async function isAffiliateAuthenticate (req, res, next) {
  try {
    req.next = next
    const token = req.headers.cookie?.split('affiliateAccessToken=')[1]?.split(';')[0]
    if (!token) {
      return req.next(UnAuthorizeUserErrorType)
    }

    const decodedToken = await jwt.verify(
      token,
      config.get('jwt.loginTokenSecret')
    )

    if (!decodedToken) return req.next(UnAuthorizeUserErrorType)

    const detail = await db.Affiliate.findOne({
      where: { affiliateId: decodedToken?.id } 
    })


    if (!detail) return req.next(UnAuthorizeUserErrorType)
    if (!detail.isActive) return req.next(AffiliateInActiveErrorType)

    req.body.affiliate = { detail }
    req.affiliate = { detail }
    req.body.affiliateId = detail.affiliateId
    req.body.affiliateCode = detail.affiliateCode
    req.next()
  } catch (error) {
    req.context.logger.error('Error in authenticationMiddleware', {
      message: error.message,
      context: {
        traceId: req?.context?.traceId,
        query: req.query,
        params: req.params,
        body: req.body,
        headers: req.headers
      },
      exception: error
    })

    next(UnAuthorizeUserErrorType)
  }
}
