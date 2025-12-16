import db from '../../db/models'
import passport from 'passport'
import config from '../../configs/app.config'
import { ROLE } from '../../utils/constants/constant'
import { getOne } from '../../utils/crud'
import { APP_ERROR_CODES } from '../../utils/constants/errors'
import { Strategy as JwtStrategy } from 'passport-jwt'
import { Strategy as LocalStrategy } from 'passport-local'
import { comparePassword, signAccessToken } from '../../utils/common'

function initPassport () {
  const opts = {}
  opts.jwtFromRequest = getAccessToken
  opts.secretOrKey = config.get('jwt.loginTokenSecret')

  passport.use(
    'login',
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
        session: false,
        passReqToCallback: true
      },
      async (req, email, password, done) => {
        email = email.toLowerCase()

        const detail = await db.AdminUser.findOne({
          where: { email },
          include: [{ model: db.AdminRole },
            { model: db.AdminUserPermission, as: 'userPermission' }]
        })
        if (detail == null) {
          return done({
            message: APP_ERROR_CODES.EMAIL_NOT_REGISTERED,
            code: 'EMAIL_NOT_REGISTERED'
          }, null)
        }

        if (!detail.isActive) {
          return done({
            message: APP_ERROR_CODES.INACTIVE_ADMIN,
            code: 'INACTIVE_ADMIN'
          })
        }

        if (!(await comparePassword(password, detail.password))) {
          return done({
            message: APP_ERROR_CODES.INCORRECT_PASSWORD,
            code: 'INCORRECT_PASSWORD'
          }, null)
        }
        const userObj = detail.get({ plain: true })
        const jwtToken = await signAccessToken({
          id: detail.adminUserId,
          email: detail.email,
          name: detail.firstName + ' ' + detail.lastName,
          role: ROLE.ADMIN
        })

        userObj.accessToken = jwtToken
        return done(null, userObj)
      }
    ))

  passport.use(new JwtStrategy(opts, async function (jwtPayload, done) {
    let detail
    if (jwtPayload.email) {
      detail = await getOne({
        model: db.AdminUser,
        data: { email: jwtPayload.email }
      })
      if (detail) {
        return done(null, { detail, userType: jwtPayload.role })
      } else {
        return done({ message: APP_ERROR_CODES.ADMIN_NOT_FOUND })
      }
    }
    return done({ message: APP_ERROR_CODES.INVALID_TOKEN })
  }))

  passport.serializeUser((detail, done) => {
    done(null, detail)
  })

  passport.deserializeUser((obj, done) => {
    done(null, obj)
  })
}

const getAccessToken = function (req) {
  return (req.cookies.adminAccessToken ? req.cookies.adminAccessToken : null)
}

module.exports = initPassport
