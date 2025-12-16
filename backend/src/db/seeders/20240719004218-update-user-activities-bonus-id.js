'use strict'

import db from '../models'
import { BONUS_TYPE, USER_ACTIVITIES_TYPE } from '../../utils/constants/constant'


module.exports = {
   up: async (queryInterface, Sequelize) => {

    const referralBonusDetails = await db.Bonus.findOne({
      where: { bonusType: BONUS_TYPE.REFERRAL_BONUS },
      order: [['createdAt', 'ASC']],
      raw: true
    })

    await db.UserActivities.update({
      bonusId: referralBonusDetails.bonusId,
    }, { where: { activityType: USER_ACTIVITIES_TYPE.REFERRAL_BONUS_CLAIMED,  bonusId: null } }) 

  },

  async down (queryInterface, DataTypes) {
  }
}
