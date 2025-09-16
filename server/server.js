import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import { connectDB } from './config/db.js'
import userRouter from './routes/user.route.js'
import chatRouter from './routes/chat.route.js'
import messageRouter from './routes/message.route.js'
import planRouter from './routes/transaction.route.js'

const app = express()
app.use(express.json())

app.use(cors())


app.get("/", (req,res) => res.send("Server is live!"))
app.use("/api/auth", userRouter);
app.use("/api/chat", chatRouter);
app.use("/api/message", messageRouter)
app.use("/api/plans", planRouter)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    connectDB()
    console.log(`App is running on PORT: ${PORT}`)
})
