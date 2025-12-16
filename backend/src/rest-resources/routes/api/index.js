import express from 'express'
import v1Router from './v1'

const apiRouter = express.Router()
apiRouter.get('/', async (_, res) => {
  try {
    res.json({ message: 'welcome admin backend api' })
  } catch (error) {
    res.status(503)
    res.send()
  }
})
apiRouter.use('/v1', v1Router)

export default apiRouter
