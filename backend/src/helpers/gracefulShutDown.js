import { sequelize } from '../db/models'
import redisClient from '../libs/redisClient'

export default async function gracefulShutDown (signal) {
  const { client } = redisClient
  
  try {
    await sequelize.close()
    await client.quit()
    console.log(`Received ${signal}`)
    process.exit(0)
  } catch (err) {
    console.log('GraceFull ShutDown Failed', err)
    process.exit(1)
  }
}
