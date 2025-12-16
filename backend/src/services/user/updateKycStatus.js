import axios from 'axios'

import db from '../../db/models'
import ajv from '../../libs/ajv'
import Logger from '../../libs/logger'
import config from '../../configs/app.config'
import ServiceBase from '../../libs/serviceBase'
import { createSignature } from '../../utils/common'
import { getOne, updateEntity } from '../../utils/crud'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { STATUS_VALUE } from '../../utils/constants/constant'
import { Op } from 'sequelize'
// import { createEmailWithDynamicValues, sendEmailMail } from '../../libs/email'

const schema = { type: 'object' }
const constraints = ajv.compile(schema)

export class UpdateKycStatusService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { ...payload } = this.args
    let query, newDocumentsList
    const kycId = payload?.verification?.id || payload?.id || payload?.sessionId

    try {
      const userDetails = await getOne({
        model: db.User,
        data: {
          [Op.or]: [
            { kycApplicantId: kycId },
            { ssnApplicantId: kycId }
          ]
        },
        attributes: ['userId', 'kycApplicantId', 'ssnApplicantId', 'veriffStatus', 'userId', 'email', 'firstName', 'lastName', 'moreDetails']
      })

      if (payload?.action === 'submitted' && userDetails?.kycApplicantId) {
        query = { veriffStatus: STATUS_VALUE.REQUESTED }

        try {
          const documentsList = await axios.get(`${config.get('kycVerification.veriffUrl')}/${kycId}/media`, {
            headers: {
              'X-AUTH-CLIENT': `${config.get('kycVerification.veriffApiKey')}`,
              'X-HMAC-SIGNATURE': `${createSignature({ payload: kycId })}`
            }
          })

          Logger.info('--------Documents fetched successfully-----------')
          newDocumentsList = documentsList.data?.images
        } catch (error) {
          Logger.info(`Error in listing Veriff documents - ${JSON.parse(error)}`)
        }
      }

      if (newDocumentsList && userDetails?.kycApplicantId) {
        const uniqueDocs = {}
        const uniqueDocuments = []

        for (const document of newDocumentsList) {
          const keyValue = document.name
          if (!uniqueDocs[keyValue]) {
            uniqueDocs[keyValue] = true

            const documentData = {
              userId: userDetails.userId,
              documentName: `VERIFF_${document.name.toUpperCase()}`,
              documentUrl: [document.url],
              signature: createSignature({ payload: document.id })
            }
            uniqueDocuments.push(documentData)
          }
        }

        await db.UserDocument.bulkCreate(uniqueDocuments)
        query = { kycApplicantId: kycId, veriffStatus: STATUS_VALUE.REQUESTED }
      }

      if (kycId && payload.status) {
        let veriffStatus
        if (userDetails?.kycApplicantId) {
          if (payload?.status.toUpperCase() === 'SUCCESS') {
            veriffStatus = payload.data?.verification?.decision?.toUpperCase()
          } else {
            veriffStatus = payload.verification.status.toUpperCase()
          }
        }
        query = (userDetails?.kycApplicantId === kycId) ? { veriffStatus: veriffStatus } : { ssnStatus: payload.verification.status.toUpperCase() }
      }

      if (query) {
        await updateEntity({ model: db.User, data: { ...query, moreDetails: { ...userDetails.moreDetails, veriffReason: payload?.verification?.reason, decisionScore: payload.verification?.decisionScore } }, values: { userId: userDetails.userId } })
      }

      return { success: true, message: SUCCESS_MSG.GET_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
