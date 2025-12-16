import ServiceBase from '../../libs/serviceBase'
import { parse } from 'csv-parse'
import db from '../../db/models'
import { UPLOAD_FILE_SIZE } from '../../utils/constants/constant'
import ajv from '../../libs/ajv'

const importCsvSchema = {
  type: 'object',
  properties: {
    file: {
      type: ['object']
    }
  }
}

const constraints = ajv.compile(importCsvSchema)
export class GetPlayerIdsPerImportCsvService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { file } = this.args

    if (!file || !file.buffer) {
      return this.addError('RequestInputValidationErrorType')
    }

    if (!this.isValidCsvFile(file)) {
      return { status: 400, message: 'Only CSV files are allowed' }
    }

    try {
      // Parse the CSV file
      let emails = await this.parseCsv(file.buffer)
      const inputEmailCount = emails.length
      emails = [...new Set(emails)]
      const validEmails = emails.filter(email => this.isValidEmail(email))

      if (!validEmails.length) {
        return this.addError('RequestInputValidationErrorType')
      }
      // get corresponding users from user table
      const users = await db.User.findAndCountAll({
        attributes: ['userId', 'email', 'username', 'isActive'],
        where: {
          email: validEmails, isActive: true, isBan: false, isRestrict: false, isInternalUser: false
        },
        raw: true
      })
      return {
        status: 200,
        message: `Successfully parsed CSV file for ${users.count} users out of ${inputEmailCount}. ${inputEmailCount - users.count} invalid email(s) rejected.`,
        data: users
      }
    } catch (error) {
      const errorMessage = `Error parsing CSV file: ${error.message}`
      console.error(errorMessage)
      if (error.status === 422) {
        return {
          status: error.status,
          message: errorMessage
        }
      }
      throw new Error(`Error processing CSV: ${error.message}`)
    }
  }

  parseCsv (fileBuffer) {
    return new Promise((resolve, reject) => {
      const emails = []

      // Parse the CSV from the file buffer
      const parser = parse({ columns: true, trim: true })

      parser.on('readable', () => {
        let record

        while ((record = parser.read())) {
          if (!record.email) {
            const err = new Error('Invalid CSV file: "email" column is required')
            err.status = 422
            reject(err)
          }
          emails.push(record.email.toLowerCase())
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

  isValidCsvFile (file) {
    const fileSize = file.size

    if (fileSize <= 0) {
      throw new Error('Invalid file size')
    }

    if (fileSize > UPLOAD_FILE_SIZE) return false

    const validMimeTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/csv'
    ]
    const validExtensions = ['csv']

    const mimeTypeValid = validMimeTypes.includes(file.mimetype)
    const extensionValid = validExtensions.includes(
      this.getFileExtension(file.originalname).toLowerCase()
    )

    return mimeTypeValid && extensionValid
  }

  getFileExtension (filename) {
    return filename.split('.').pop()
  }

  isValidEmail (email) {
    // Regular expression for email validation
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
    return emailRegex.test(email)
  }
}
