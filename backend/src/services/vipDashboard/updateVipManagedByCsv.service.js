import ServiceBase from '../../libs/serviceBase'
import { parse } from 'csv-parse'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { UPLOAD_FILE_SIZE } from '../../utils/constants/constant'
import ajv from '../../libs/ajv'

const schema = {
  type: 'object',
  properties: {
    file: { type: ['object'] },
    managedById: { type: 'string' }
  },
  required: ['file']
}

const constraints = ajv.compile(schema)

export class UpdateVipManagedByFromCsv extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      dbModels: { UserInternalRating, VipManagerAssignment },
      sequelizeTransaction: transaction
    } = this.context
    const { file, managedById } = this.args

    if (!file || !file.buffer) {
      return this.addError('RequestInputValidationErrorType', ['CSV file is required.'])
    }

    if (!this.isValidCsvFile(file)) {
      return { success: false, message: 'Only valid CSV files are allowed' }
    }

    try {
      const { userIds, managedBy } = await this.parseCsv(file.buffer)

      if (!userIds.length) {
        return this.addError('RequestInputValidationErrorType', [
          'CSV must contain at least one valid userId.'
        ])
      }

      const validUsers = await UserInternalRating.findAll({
        where: { userId: userIds },
        attributes: ['userId']
      })

      const validUserIds = validUsers.map(u => u.userId)

      if (!validUserIds.length) {
        return this.addError('RequestInputValidationErrorType', ['No valid users found in CSV'])
      }

      const managerId = +managedBy || +managedById
      const assignmentDate = new Date()

      // 1. Close current active assignments (if any) for all users
      await VipManagerAssignment.update(
        { endDate: assignmentDate },
        { where: { userId: validUserIds, endDate: null }, transaction }
      )

      // 2. Insert new assignment history rows
      const assignmentRecords = validUserIds.map(userId => ({
        userId,
        managerId,
        assignedAt: assignmentDate,
        endDate: null
      }))
      await VipManagerAssignment.bulkCreate(assignmentRecords, { transaction })

      // 3. Update shortcut column in UserInternalRating
      await UserInternalRating.update(
        { managedBy: managerId, managedByAssignmentDate: assignmentDate },
        { where: { userId: validUserIds }, transaction }
      )

      return { success: true, message: SUCCESS_MSG.UPDATE_SUCCESS }
    } catch (error) {
      const errorMessage = `Error processing CSV: ${error.message}`
      console.error(errorMessage)
      if (error.status === 422) {
        return { status: error.status, message: errorMessage }
      }
      return this.addError('InternalServerErrorType', error)
    }
  }

  parseCsv (fileBuffer) {
    return new Promise((resolve, reject) => {
      const userIds = new Set()
      let managedBy = null

      const parser = parse({ columns: true, trim: true })

      parser.on('readable', () => {
        let record
        while ((record = parser.read())) {
          const userId = record.userId?.trim()
          const manager = record.managedBy?.trim()

          if (!userId) {
            const err = new Error('Invalid CSV file: "userId" column is required')
            err.status = 422
            return reject(err)
          }

          userIds.add(userId)
          if (!managedBy && manager) managedBy = manager
        }
      })

      parser.on('end', () => {
        resolve({ userIds: Array.from(userIds), managedBy })
      })

      parser.on('error', err => reject(err))

      parser.write(fileBuffer)
      parser.end()
    })
  }

  isValidCsvFile (file) {
    const fileSize = file.size

    if (fileSize <= 0 || fileSize > UPLOAD_FILE_SIZE) {
      return false
    }

    const validMimeTypes = ['text/csv', 'application/vnd.ms-excel', 'application/csv']
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
}
