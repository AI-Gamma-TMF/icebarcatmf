import config from '../configs/app.config'
import { s3 } from '../libs/aws-s3'
export async function uploadFiles (files) {
  const s3Config = config.getProperties().s3

  try {
    const awaitedFiles = await Promise.all(files)
    const dataToInsert = []
    for (const ele of awaitedFiles) {
      const element = {}
      const s3Params = {
        ACL: 'public-read',
        Bucket: s3Config.bucket,
        Key: ele.key,
        Body: ele.buffer
      }
      const uploadedFile = await s3.upload(s3Params).promise()
      element.documentUrl = uploadedFile.Location
      element.documentName = ele.fieldname
      element.documentKey = ele.key
      dataToInsert.push(element)
    }
    return dataToInsert
  } catch (e) {
    return ('UploadErrorErrorType')
  }
}
