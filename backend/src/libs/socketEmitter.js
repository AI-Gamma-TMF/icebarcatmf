import { Emitter } from '@socket.io/redis-emitter'
import redisClient from './redisClient'

const redisDetail = redisClient
const socketEmitter = new Emitter(redisDetail.publisherClient)

export default socketEmitter
