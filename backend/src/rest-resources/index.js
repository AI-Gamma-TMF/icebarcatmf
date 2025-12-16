import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import i18n from '../libs/i18n'
import routes from '../rest-resources/routes'
import passport from 'passport'
import initPassport from '../rest-resources/middlewares/passport'
import errorHandlerMiddleware from './middlewares/errorHandler.middleware'
import config from '../configs/app.config'
const app = express()

app.use(helmet())

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())

app.use(morgan('tiny'))

app.use(i18n.init)
initPassport()
app.use(passport.initialize())

// app.use(passport.session())

// CORS Configuration
const corsOptions = {
  credentials: true,
  origin: config.get('origin').split(','),
  methods: ['GET, POST, PUT, PATCH, DELETE']
}

app.use(cors(corsOptions))

app.use(routes)

app.use(async (req, res) => {
  res.status(404).json({ status: 'Not Found' })
})

app.use(errorHandlerMiddleware)

export default app
