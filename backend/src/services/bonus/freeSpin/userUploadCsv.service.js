import ServiceBase from '../../../libs/serviceBase'
import { removeData, setData } from '../../../utils/common'
import { USER_CATEGORY } from '../../../utils/constants/constant'
import { ERROR_MSG, ERRORS } from '../../../utils/constants/errors'
import { parse } from 'csv-parse'

export class UserUploadCsvFreeSpin extends ServiceBase {
  async run () {
    const {
      dbModels: { User: UserModel }
    } = this.context

    const { file } = this.args
    try {
      // read the csv file and get user 's userId
      let userIds = await this.parseCsv(file.buffer)
      userIds = [...new Set(userIds)]
      const validUserIds = userIds.filter(userId => this.isValidUserId(userId))

      if (!validUserIds.length) {
        return this.addError('RequestInputValidationErrorType')
      }

      const result = await this.getUserStatusSummary(UserModel, validUserIds)
      if (!result) {
        return this.addError(ERRORS.BAD_DATA, ERROR_MSG.NO_ACTIVE_USER)
      }

      return { status: true, message: 'Record Uploaded Successfully!' }
    } catch (error) {
      if (error.status === 422) {
        return this.addError('InvalidCsvFileUserIdAndEmailColumnAreRequiredErrorType')
      }
      console.log('Error in GetProviderListAllowSpinService', error)
      return this.addError('InternalServerErrorType', error)
    }
  }

  // function to read data from csv
  parseCsv (fileBuffer) {
    return new Promise((resolve, reject) => {
      const userIds = []

      // Parse the CSV from the file buffer
      const parser = parse({ columns: true, trim: true })

      parser.on('readable', () => {
        let record

        while ((record = parser.read())) {
          if (!(record.userId && record.email)) {
            const err = new Error(
              'Invalid CSV file: "userId" and "email"columns are required'
            )
            err.status = 422
            reject(err)
          }
          userIds.push(record.userId)
        }
      })

      parser.on('end', () => {
        resolve(userIds)
      })

      parser.on('error', err => {
        reject(err)
      })

      // Write the buffer into the parser
      parser.write(fileBuffer)
      parser.end()
    })
  }

  isValidUserId (userId) {
    return Number.isInteger(Number(userId)) && Number(userId) > 0
  }

  async getUserStatusSummary (UserModel, validUserIds) {
    const BATCH_SIZE = 10000
    const categoryMap = {
      internal: [],
      banned: [],
      restricted: [],
      inactive: [],
      active: [],
      selfExcluded: []
    }

    for (let i = 0; i < validUserIds.length; i += BATCH_SIZE) {
      const batch = validUserIds.slice(i, i + BATCH_SIZE)

      const users = await UserModel.findAll({
        where: { userId: batch },
        attributes: ['userId', 'email', 'isInternalUser', 'isBan', 'isRestrict', 'isActive', 'selfExclusion']
      })

      // iterate each user
      for (const user of users) {
        const userId = user?.userId
        const email = user?.email
        let category = USER_CATEGORY.ACTIVE // default

        if (user.isInternalUser) category = USER_CATEGORY.INTERNAL
        else if (user.isBan) category = USER_CATEGORY.BANNED
        else if (user.isRestrict) category = USER_CATEGORY.RESTRICTED
        else if (!user.isActive) category = USER_CATEGORY.INACTIVE
        else if (user.selfExclusion) category = USER_CATEGORY.SELF_EXCLUDED

        // categoryMap[category].push(userId)
        categoryMap[category].push({ userId, email })
      }
    }

    const DEFAULT_EXPIRY_REDIS_CLIENT_SECONDS = 24 * 60 * 60 // 1 day expiry
    // store in redis
    if (categoryMap.active.length > 0) {
      await removeData('user-status-freeSpin-user-list')
      await setData('user-status-freeSpin-user-list', JSON.stringify(categoryMap), DEFAULT_EXPIRY_REDIS_CLIENT_SECONDS)
      return true
    } else {
      return false
    }
  }
}
