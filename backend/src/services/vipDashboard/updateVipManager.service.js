import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'

const schema = {
  type: 'object',
  properties: {
    userId: { type: 'string' },
    managedByAdminId: { type: 'string' }
  },
  required: ['userId', 'managedByAdminId']
}

const constraints = ajv.compile(schema)

export class UpdateVipManagerService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      dbModels: { UserInternalRating: UserInternalRatingModel, User: UserModel, VipManagerAssignment: VipManagerAssignmentModel },
      sequelizeTransaction: transaction
    } = this.context
    const { userId, managedByAdminId } = this.args

    try {
      const userDetail = await UserModel.findOne({
        where: { userId },
        attributes: ['userId'],
        include: {
          model: UserInternalRatingModel,
          attributes: ['managedBy'],
          required: true
        }
      })

      if (!userDetail) return this.addError('UserNotExistsErrorType')

      // 1. Close the current active assignment if any
      await VipManagerAssignmentModel.update(
        { endDate: new Date() },
        { where: { userId: +userId, endDate: null }, transaction }
      )
      // 2. Insert new assignment row
      await VipManagerAssignmentModel.create({
        userId,
        managerId: +managedByAdminId,
        assignedAt: new Date(),
        endDate: null
      }, { transaction })

      // 3. Update current shortcut column in UserInternalRating
      const updatedDetails = { managedBy: +managedByAdminId, managedByAssignmentDate: new Date() }
      await UserInternalRatingModel.update(updatedDetails, { where: { userId }, transaction })

      return { success: true, message: SUCCESS_MSG.UPDATE_SUCCESS }
    } catch (error) {
      return this.addError('InternalServerErrorType', error)
    }
  }
}
