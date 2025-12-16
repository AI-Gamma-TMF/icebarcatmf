import { createAdapter } from '@socket.io/redis-adapter'
import { Server as SocketServer } from 'socket.io'
import { InternalServerErrorType } from '../utils/constants/errors'
import i18n from '../libs/i18n'
import Logger from '../libs/logger'
import { getLocalizedError, isTrustedError } from '../utils/error.utils'
import argumentsDecoratorSocketMiddleware from './middlewares/argumentsDecoratorSocket.middleware'
import namespaces from './namespaces'
import redisClient from '../libs/redisClient'

// TODO: specify the particular origin
const socketCorsOptions = {
  cors: { origin: { origin: '*' } }
}

const socketServer = new SocketServer(socketCorsOptions)
const redisDetail = redisClient
socketServer.on('new_namespace', (namespace) => {
  namespace.use((socket, next) => {
    const req = socket.request

    i18n.init(req)

    socket.on('error', (error) => {
      if (isTrustedError(error)) {
        socket.emit('error', { data: {}, errors: [getLocalizedError(error, socket.request.__)] })
      } else {
        Logger.error(
          (error.name || InternalServerErrorType.name),
          {
            message: error.message || error.description,
            fault: error.fields
          })
        socket.emit('error', { data: {}, errors: [getLocalizedError(InternalServerErrorType, socket.request.__)] })
      }
    })

    socket.use(argumentsDecoratorSocketMiddleware(socket))

    next()
  })
})

socketServer.adapter(createAdapter(redisDetail.publisherClient, redisDetail.subscriberClient))

namespaces(socketServer)

export default socketServer
