import axios from 'axios'
import config from '../configs/app.config'
import { InternalServerErrorType } from '../utils/constants/errors'
import { ACCESS_EMAIL_TEMPLATES } from '../utils/constants/constant'

const {
  api_key: apiKey,
  base_url: baseUrl,
  sender_email: senderEmail,
  sender_name: senderName
} = config.getProperties().send_grid

export const sendMail = async ({
  email,
  dynamicData,
  emailTemplate,
  token,
  userId,
  transaction
}) => {
  if (!emailTemplate.templateId) return 'InternalServerErrorType'
  const frontendHost = config.get().adminFrontendUrl || 'http://127.0.01'
  let verificationLink
  switch (emailTemplate.templateId) {
    case ACCESS_EMAIL_TEMPLATES.FORGET_PASSWORD.templateId:
      verificationLink = `${frontendHost}/affiliates/forgotPassword?token=${token}`
      break
    case ACCESS_EMAIL_TEMPLATES.VERIFY_FORGET_PASSWORD.templateId:
      verificationLink = `${frontendHost}/affiliates/verifyForgetPassword?token=${token}`
      break
    case ACCESS_EMAIL_TEMPLATES.VERIFY_EMAIL.templateId:
      verificationLink = `${frontendHost}/affiliates/set-Password?token=${token}`
      break
    case ACCESS_EMAIL_TEMPLATES.PROFILE_UPDATED.templateId:
      verificationLink = `${frontendHost}/affiliates/profile`
      break
    case ACCESS_EMAIL_TEMPLATES.REDEEM_REQUEST_APPROVED.templateId:
      verificationLink = `${frontendHost}/bets`
      break
    default:
      break
  }

  const options = {
    url: baseUrl,
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`
    },
    data: {
      from: { email: senderEmail, name: senderName },
      personalizations: [
        {
          to: [{ email }],
          dynamic_template_data: { ...dynamicData, verificationLink }
        }
      ],
      template_id: emailTemplate.templateId
    }
  }
  try {
    const response = await axios(options)
    return response
  } catch (error) {
    console.log('Error while sending mail to user ', senderEmail, error)
    throw InternalServerErrorType
  }
}

export const emailCenterSendMail = async ({
  email,
  emailTemplate,
  subject // Full HTML content of the template
}) => {
  const options = {
    url: baseUrl,
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    data: {
      from: { email: senderEmail, name: senderName },
      personalizations: [
        {
          to: [{ email }], // Recipient email
          subject
        }
      ],
      content: [
        {
          type: 'text/html',
          value: emailTemplate
        }
      ]
    }
  }

  try {
    const response = await axios(options)
    return { success: true, response }
  } catch (error) {
    console.error('Error while sending mail to user', email, error)
    return { success: false, error }
  }
}
