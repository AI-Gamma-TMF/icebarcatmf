import axios from 'axios'
import config from '../../configs/app.config'
import ServiceBase from '../../libs/serviceBase'
import Logger from '../../libs/logger'

export class GSoftLoginService extends ServiceBase {
  async run () {
    const {
      sinartra_game_url: gameUrl,
      email,
      version,
      password
    } = config.getProperties().gSoft

    const options = {
      method: 'POST',
      url: `${gameUrl}/${version}/login`,
      data: {
        email,
        password
      },
      headers: {
        'Accept-Encoding': 'application/json'
      }
    }

    try {
      const data = await axios(options)
      if (data.status === 200) { return { status: 200, token: data.headers['jwt-auth'] } }

      if (data.status === 400) return this.addError('UsernameOrPasswordIncorrectErrorType')
      if (data.status === 500) return this.addError('InternalServerErrorType')
    } catch (error) {
      console.log(error)
      Logger.error('Error while logging in to Sintara', error)
      return this.addError('InternalServerErrorType')
    }
  }
}
