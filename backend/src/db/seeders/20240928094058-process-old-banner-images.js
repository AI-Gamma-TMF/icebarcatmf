import sharp from 'sharp'
import { Op } from 'sequelize'
import { uploadFile, fetchFileFromS3 } from '../../utils/common'
const { default: db } = require('../models')

async function processBanner (banner, transaction) {
  const { pageBannerId, desktopImageUrl } = banner

  try {
    // Step 3: Download existing image from S3
    const originalBuffer = await fetchFileFromS3(desktopImageUrl)

    // Step 4: Convert to WebP
    const webpBuffer = await sharp(originalBuffer).webp({ quality: 80 }).toBuffer()
    // Step 5: Use the same key as the original file but replace extension with '.webp'
    const newFileName = desktopImageUrl.replace(/\.[^.]+$/, '.webp') // Replace extension with .webp

    await uploadFile(
      { buffer: webpBuffer, mimetype: 'image/webp' },
      newFileName
    )

    // Step 6: Update the database
    await db.PageBanner.update(
      { desktopImageUrl: newFileName },
      { where: { pageBannerId }, transaction }
    )
  } catch (error) {
    console.error(`Error processing Banner ID: ${pageBannerId}`, error)
    throw error // Ensure transaction rollback in case of failure
  }
}

export async function up (queryInterface, Sequelize) {
  const transaction = await queryInterface.sequelize.transaction()
  try {
    // Step 1: Fetch banners needing updates
    const oldBanners = await db.PageBanner.findAll({
      attributes: ['pageBannerId', 'desktopImageUrl'],
      where: {
        desktopImageUrl: { [Op.ne]: null },
        [Op.or]: [{ desktopImageUrl: { [Op.notILike]: '%.webp' } }]
      },
      transaction
    })

    if (!oldBanners.length) {
      console.log('No records found for conversion')
      return
    }

    // Step 2: Process all records concurrently
    await Promise.all(oldBanners.map(banner => processBanner(banner)))

    await transaction.commit()
  } catch (error) {
    console.error('Error during banner update:', error)
    await transaction.rollback()
  }
}
