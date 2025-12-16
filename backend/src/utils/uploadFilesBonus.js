import config from '../configs/app.config'
import { s3 } from '../libs/aws-s3'
export async function uploadFilesBonus (files, entity, logicalEntity) {
  const s3Config = config.getProperties().s3

  try {
    const awaitedFiles = await Promise.all(files)
    const dataToInsert = []
    for (const ele of awaitedFiles) {
      const element = {}
      const day = ele.fieldname.split('_')[1]
      const entityId = entity[day].bonusId
      const key = `${config.get('env')}/assets/${logicalEntity}/${day}/${ele.fieldname + '_' + entityId}.${ele.mimetype.split('/')[1]}`

      const s3Params = {
        ACL: 'public-read',
        Bucket: s3Config.bucket,
        Key: key,
        Body: ele.buffer
      }
      const uploadedFile = await s3.upload(s3Params).promise()
      element.documentUrl = uploadedFile.Location
      element.entity = entity[day]
      element.documentName = ele.fieldname
      element.documentKey = key
      dataToInsert.push(element)
    }
    return dataToInsert
  } catch (e) {
    return ('UploadErrorErrorType')
  }
}
