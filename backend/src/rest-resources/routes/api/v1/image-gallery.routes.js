import express from 'express'
import ImageGalleryController from '../../../controllers/gallery.controller'
import { checkPermission, isAdminAuthenticated } from '../../../middlewares'
import contextMiddleware from '../../../middlewares/context.middleware'
import multer from 'multer'
import requestValidationMiddleware from '../../../middlewares/requestValidation.middleware'
import responseValidationMiddleware from '../../../middlewares/responseValidation.middleware'
import {
  deleteImageSchemas,
  uploadImageSchemas
} from '../../../middlewares/validation/imageGallery-validation.schemas'
const upload = multer()
const args = { mergeParams: true }
const galleryRouter = express.Router(args)

galleryRouter
  .route('/')
  .get(
    requestValidationMiddleware({}),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    ImageGalleryController.getList,
    responseValidationMiddleware({})
  )

  .post(
    upload.single('image'),
    requestValidationMiddleware(uploadImageSchemas),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    ImageGalleryController.uploadImage,
    responseValidationMiddleware({})
  )

  .delete(
    requestValidationMiddleware(deleteImageSchemas),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    ImageGalleryController.deleteImage,
    responseValidationMiddleware({})
  )

export default galleryRouter
