import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import { connectDB } from './config/db.js'
import userRouter from './routes/user.route.js'
import chatRouter from './routes/chat.route.js'

const app = express()

app.use(cors())
app.use(express.json())


app.use("/api/auth", userRouter);
app.use("/api/chat", chatRouter)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    connectDB()
    console.log(`App is running on PORT: ${PORT}`)
})
