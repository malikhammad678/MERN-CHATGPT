import express from 'express'
import { protectedRoute } from '../middleware/protectedroute.js'
import { createChat, deleteChat, getChats } from '../controllers/chat.controller.js'

const chatRouter = express.Router()

chatRouter.post("/create", protectedRoute, createChat)
chatRouter.get("/get", protectedRoute, getChats)
chatRouter.post("/delete", protectedRoute, deleteChat)

export default chatRouter;