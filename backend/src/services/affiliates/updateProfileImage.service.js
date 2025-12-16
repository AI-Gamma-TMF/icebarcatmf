import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { validateFile } from '../../utils/common'
import { OK } from '../../utils/constants/constant'
import { uploadImageFile } from '../../utils/uploadImageFile'
import { s3 } from '../../libs/aws-s3'
import config from '../../configs/app.config'

const s3Config = config.getProperties().s3

export class UploadProfileImageService extends ServiceBase {
  async run () {
    const {
      req: {
        affiliate: { detail: affiliate },
        files
      },
      dbModels: { Affiliate: AffiliateModel },
      sequelizeTransaction: transaction
    } = this.context

    try {
      if (affiliate?.profileImage) {
        const deleteParams = {
          Bucket: s3Config.bucket,
          Key: affiliate.profileImage
        }
        await s3.deleteObject(deleteParams).promise()
      }

      const profileImageValidate = validateFile(null, files)
      if (profileImageValidate !== OK) {
        return this.addError(`${profileImageValidate}`)
      }

      const uploadedFiles = await uploadImageFile(files, affiliate)
      await AffiliateModel.update(
        {
          profileImage: uploadedFiles[0].key
        },
        {
          where: {
            affiliateId: affiliate.affiliateId
          },
          transaction
        }
      )

      return {
        status: 200,
        message: SUCCESS_MSG.UPLOAD_SUCCESS,
        profileImage: uploadedFiles[0]?.documentUrl
      }
    } catch (error) {
      console.log(error)
      return this.addError('FileUploadFailedErrorType')
    }
  }
}
