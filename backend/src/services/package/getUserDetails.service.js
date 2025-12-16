import { Op } from 'sequelize'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'

export class GetUserDetailsService extends ServiceBase {
  async run () {
    const {
      dbModels: { User: UserModel }
    } = this.context
    const { userId, username, email } = this.args

    let query = {}

    if (userId) query = { userId: +userId }
    if (email) query = { ...query, email: { [Op.iLike]: `%${email}%` } }
    if (username) query = { ...query, username: { [Op.iLike]: `%${username}%` } }

    const user = await UserModel.findAll({
      attributes: ['userId', 'email', 'username', 'isActive'],
      where: query
    })

    return {
      user,
      success: true,
      message: SUCCESS_MSG.GET_SUCCESS
    }
  }
}
