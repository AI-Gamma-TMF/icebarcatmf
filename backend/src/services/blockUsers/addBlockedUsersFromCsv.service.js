import ServiceBase from '../../libs/serviceBase'
import { parse } from 'csv-parse'
import { SUCCESS_MSG } from '../../utils/constants/success'
import db from '../../db/models'
import { UPLOAD_FILE_SIZE } from '../../utils/constants/constant'
import ajv from '../../libs/ajv'
import redisClient from '../../libs/redisClient'

const schema = {
  type: 'object',
  properties: {
    blockUsers: {
      type: 'string',
      enum: ['true', 'false']
    },
    file: {
      type: ['object']
    }
  },
  required: ['blockUsers']
}

const constraints = ajv.compile(schema)

export class AddBlockedUsersFromCsv extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { file, blockUsers } = this.args

    await redisClient.client.del('blocked-users')

    if (!file || !file.buffer) {
      return this.addError('RequestInputValidationErrorType')
    }

    if (!this.isValidCsvFile(file)) {
      return { status: 400, message: 'Only CSV files are allowed' }
    }

    try {
      const transaction = this.context.sequelizeTransaction

      // Parse the CSV file
      let emails = await this.parseCsv(file.buffer)
      emails = [...new Set(emails)]
      const validEmails = emails.filter(email => this.isValidEmail(email))
      const inputEmailCount = emails.length

      if (!validEmails.length) {
        return this.addError('RequestInputValidationErrorType')
      }

      // get corresponding userIds from user table
      const userIds = await db.User.findAll({
        attributes: ['user_id'],
        where: {
          email: validEmails
        },
        raw: true
      })
      const validUserIdCount = userIds.length
      const rejectedCount = Math.max(0, inputEmailCount - validUserIdCount)

      const blockMode = blockUsers === 'true'
      // add them to block_user table
      const formattedUsers = userIds.map(user => ({
        userId: user.user_id,
        isAvailPromocodeBlocked: blockMode
      }))

      await db.BlockedUsers.bulkCreate(
        formattedUsers,
        {
          updateOnDuplicate: ['isAvailPromocodeBlocked']
        },
        { transaction }
      )

      const message = blockMode ? SUCCESS_MSG.BLOCK_SUCCESS : SUCCESS_MSG.UNBLOCK_SUCCESS
      return {
        status: 200,
        message: message + ` for ${validUserIdCount} users out of ${inputEmailCount}. ${rejectedCount} unmatched email(s) rejected.`
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
