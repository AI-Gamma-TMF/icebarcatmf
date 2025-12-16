// import { sequelize } from '../../db/models'
// import ServiceBase from '../../libs/serviceBase'
// import { SUCCESS_MSG } from '../../utils/constants/success'

// export class GetPromocodesForGraphService extends ServiceBase {
//   async run () {
//     const { startDate, endDate } = this.args

//     const data = await sequelize.query(
//       `SELECT DISTINCT
//         ON (PROMOCODE) PROMOCODE
//       FROM
//         CRM_PROMOTIONS
//       WHERE
//         CRM_PROMOCODE = FALSE
//         AND DELETED_AT IS NOT NULL
//         AND CRM_PROMOTION_ID IN (
//           SELECT DISTINCT
//             ON (PROMOCODE_ID) PROMOCODE_ID
//           FROM
//             USER_BONUS
//           WHERE
//             CLAIMED_AT BETWEEN :startDate AND :startDate
//             AND BONUS_TYPE = 'promotion-bonus'
//         )
//       `,
//       {
//         type: sequelize.QueryTypes.SELECT,
//         replacements: {
//           startDate,
//           endDate
//         }
//       }
//     )

//     return {
//       success: true,
//       message: SUCCESS_MSG.GET_SUCCESS,
//       data
//     }
//   }
// }
