import express from 'express'
import { checkPermission, isAdminAuthenticated } from '../../../middlewares'
import contextMiddleware from '../../../middlewares/context.middleware'
import requestValidationMiddleware from '../../../middlewares/requestValidation.middleware'
import responseValidationMiddleware from '../../../middlewares/responseValidation.middleware'
import BlogPostController from '../../../controllers/blogPost.controller'
import multer from 'multer'
import GamePageController from '../../../controllers/gamePage.controller'

const args = { mergeParams: true }
const blogPostRoutes = express.Router(args)
const upload = multer()

blogPostRoutes
  .route('/')
  .get(
    requestValidationMiddleware({}),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    BlogPostController.getBlogPost,
    responseValidationMiddleware({})
  )
  .post(
    upload.single('bannerImageUrl'),
    requestValidationMiddleware({}),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    BlogPostController.createBlogPost,
    responseValidationMiddleware({})
  )
  .put(
    upload.single('bannerImageUrl'),
    requestValidationMiddleware({}),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    BlogPostController.updateBlogPost,
    responseValidationMiddleware({})
  )
  .delete(
    requestValidationMiddleware({}),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    BlogPostController.deleteBlogPost,
    responseValidationMiddleware({})
  )
  .patch(
    requestValidationMiddleware({}),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    BlogPostController.updateBlogPostStatus,
    responseValidationMiddleware({})
  )

blogPostRoutes
  .route('/faq')
  .get(
    requestValidationMiddleware({}),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    BlogPostController.getBlogPostFaq,
    responseValidationMiddleware({})
  )
  .post(
    requestValidationMiddleware({}),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    BlogPostController.createBlogPostFaq,
    responseValidationMiddleware({})
  )
  .delete(
    requestValidationMiddleware({}),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    BlogPostController.deleteBlogPostFaq,
    responseValidationMiddleware({})
  )

blogPostRoutes.route('/game-page')
  .get(
    requestValidationMiddleware({}),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    GamePageController.getGamePage,
    responseValidationMiddleware({})
  )

export default blogPostRoutes
