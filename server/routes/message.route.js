import express from 'express'
import { protectedRoute } from '../middleware/protectedroute.js'
import { imageMessageController, textMessageController } from '../controllers/message.controller.js'

const messageRouter = express.Router()

messageRouter.post('/text', protectedRoute, textMessageController)
messageRouter.post('/image', protectedRoute, imageMessageController)

export default messageRouter;