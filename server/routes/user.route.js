import express from 'express'
import { getPublishedImages, getUser, login, signup } from '../controllers/user.controller.js'
import { protectedRoute } from '../middleware/protectedroute.js'

const userRouter = express.Router()

userRouter.post('/signup', signup)
userRouter.post('/login', login)
userRouter.get('/me', protectedRoute, getUser)
userRouter.get("/images", protectedRoute, getPublishedImages)

export default userRouter;