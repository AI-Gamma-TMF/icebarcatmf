import nodeMailer from '../libs/nodeMailer'
import Logger from './logger'

export const sendMail = async ({ from, to, subject, html }) => {
  try {
    nodeMailer.sendMail({
      from,
      to,
      subject,
      html
    }, (err, info) => {
      if (err) {
        Logger.info('SendMail', { message: `Error: ${err}` })
      } else {
        Logger.info('SendMail', { message: `Response: ${info}` })
      }
    })
  } catch (error) {
    Logger.info('SendMail', { message: `Error: ${error}` })
  }
}
