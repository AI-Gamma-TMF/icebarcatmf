import ServiceBase from '../../libs/serviceBase'
import { notifyUserByEmailJobScheduler } from '../../utils/common'
import { parse } from 'csv-parse'
import { SUCCESS_MSG } from '../../utils/constants/success'

export class ProcessUserEmailFromCsvService extends ServiceBase {
  async run () {
    const {
      dbModels: {
        EmailTemplates: EmailTemplatesModel
      },
      sequelizeTransaction: transaction
    } = this.context

    const { emailTemplateId, file } = this.args
    try {
      const checkTemplateExists = await EmailTemplatesModel.findOne({
        where: { emailTemplateId: +emailTemplateId },
        transaction,
        raw: true
      })

      if (!checkTemplateExists) {
        return this.addError('EmailTemplateNotFoundErrorType')
      }

      // read the csv file and get user email
      let emails = await this.parseCsv(file.buffer)
      emails = [...new Set(emails)]
      const validEmails = emails.filter(email => this.isValidEmail(email))

      if (!validEmails.length) {
        return this.addError('RequestInputValidationErrorType')
      }

      // working start for batch
      const BATCH_SIZE = 500
      for (let i = 0; i < validEmails.length; i += BATCH_SIZE) {
        const batchEmail = validEmails.slice(i, i + BATCH_SIZE)
        await notifyUserByEmailJobScheduler({
          usersEmail: batchEmail,
          emailTemplateId: +emailTemplateId
        })
      }
      // working end for batch
      return { success: true, message: SUCCESS_MSG.EMAIL_SUCCESS }
    } catch (error) {
      if (error.status === 422) {
        return this.addError('InvalidCsvFileEmailColumnIsRequiredErrorType')
      }
      console.log('ERROR OCCUR IN ProcessUserEmailFromCsvService')
      return this.addError('InternalServerErrorType', error)
    }
  }

  // function to read data from csv
  parseCsv (fileBuffer) {
    return new Promise((resolve, reject) => {
      const emails = []

      // Parse the CSV from the file buffer
      const parser = parse({ columns: true, trim: true })

      parser.on('readable', () => {
        let record

        while ((record = parser.read())) {
          if (!record.email) {
            const err = new Error(
              'Invalid CSV file: "email" column is required'
            )
            err.status = 422
            reject(err)
          }
          emails.push(record.email)
        }
      })

      parser.on('end', () => {
        resolve(emails)
      })

      parser.on('error', err => {
        reject(err)
      })

      // Write the buffer into the parser
      parser.write(fileBuffer)
      parser.end()
    })
  }

  isValidEmail (email) {
    // Regular expression for email validation
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
    return emailRegex.test(email)
  }
}
