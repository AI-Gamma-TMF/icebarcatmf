import jwt from 'jsonwebtoken'
import config from '../../configs/app.config'
import {
  AdminNotFoundErrorType,
  UnAuthorizeUserErrorType,
} from '../../utils/constants/errors'
import Logger from '../../libs/logger'
import { error } from 'winston'
import db from '../../db/models'

export default async function adminAuthenticationSocketNamespaceMiddleWare (
  socket,
  next
) {
  try {
    const accessToken = socket.handshake.headers.cookie
      .split('adminAccessToken=')[1]
      ?.split(';')[0]

    if (!accessToken) next(UnAuthorizeUserErrorType)

    const payload = await jwt.verify(
      accessToken,
      config.get('jwt.loginTokenSecret')
    )

    if (!payload) next(UnAuthorizeUserErrorType)

    let { email } = payload

    email = email.toLowerCase()

    const detail = await db.AdminUser.findOne({
      where: { email },
      include: [
        { model: db.AdminRole },
        { model: db.AdminUserPermission, as: 'userPermission' }
      ]
    })

    if (!detail) next(AdminNotFoundErrorType)

    next()
  } catch (err) {
    Logger.error('Error in authenticationSocketMiddleware', {
      message: err.message,
      context: socket.handshake,
      exception: err
    })
    return next(error)
  }
}
