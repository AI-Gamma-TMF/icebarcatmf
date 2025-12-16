import { SUCCESS_MSG } from '../../utils/constants/success'
import ServiceBase from '../../libs/serviceBase'
import RedisClient from '../../libs/redisClient'

export class StoreStateService extends ServiceBase {
  async run () {
    const states = this.args

    if (!Array.isArray(states)) {
      return {
        success: false,
        message: 'Invalid data format. Expected an array of states.'
      }
    }

    const cacheKey = 'allowed_states'
    await RedisClient.client.del(cacheKey)
    await RedisClient.client.set(cacheKey, JSON.stringify(states))

    return {
      success: true,
      data: states,
      message: SUCCESS_MSG.UPDATE_SUCCESS
    }
  }
}
