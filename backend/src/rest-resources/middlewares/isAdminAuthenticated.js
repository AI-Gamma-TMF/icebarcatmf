import passport from 'passport'

import { ROLE, ROLE_ID } from '../../utils/constants/constant'
import { AdminInActiveErrorType, AdminNotFoundErrorType, UnAuthorizeUserErrorType, APP_ERROR_CODES } from '../../utils/constants/errors'

export function isAdminAuthenticated (req, res, next) {
  req.next = next
  passport.authenticate('jwt', (err, data) => {
    if (err) {
      if (err.message === APP_ERROR_CODES.ADMIN_NOT_FOUND) {
        return req.next(UnAuthorizeUserErrorType)
      }
      return req.next(UnAuthorizeUserErrorType)
    }
    req.login(data, loginErr => {
      if (loginErr) return req.next(UnAuthorizeUserErrorType)

      if ((data.userType !== ROLE.ADMIN) && (data.detail.roleId !== ROLE_ID.ADMIN)) {
        return req.next(AdminNotFoundErrorType)
      }

      if (!data.detail.isActive) return req.next(AdminInActiveErrorType)

      req.body.user = data.detail
      req.body.id = data.detail.adminUserId
      req.body.userType = data.userType

      next()
    })
  })(req, res, next)
}