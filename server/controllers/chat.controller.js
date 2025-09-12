import Chat from "../models/chat.model.js";

export const createChat = async (req,res) => {
    try {
        const user = req.user;
        const chatData = {
            userId:user._id,
            messages:[],
            userName:user.name,
            name:"New Chat"
        }
        const chat = await Chat.create(chatData)
        res.status(200).json({ success:true, message:"Chat Created", chat })
    } catch (error) {
        res.status(500).json({ success:false, message:error.message })
    }
}

export const getChats = async (req,res) => {
    try {
        const userId = req.user._id
        const chats = await Chat.find({ userId:userId }).sort({ updatedAt:-1 })
        res.status(200).json({ success:true, chats })

    } catch (error) {
        res.status(500).json({ success:false, message:error.message })
    }
}

export const deleteChat = async (req,res) => {
    try {
        const userId = req.user._id;
        const { chatId } = req.body;
        await Chat.deleteOne({ _id:chatId, userId })
        res.status(200).json({ success:true, message:"Chat Deleted!" })
    } catch (error) {
        res.status(500).json({ success:false, message:error.message })
    }
}