import openai from "../config/openai.js";
import Chat from "../models/chat.model.js";
import User from "../models/user.model.js";

// Text based AI Chat controller
export const textMessageController = async (req,res) => {
    try {
        const userId = req.user._id
        const { chatId, prompt } = req.body;
        const chat = await Chat.findOne({ _id:chatId, userId })
        chat.messages.push({ role:"user" , content: prompt, timestamp:Date.now(), isImage:false })

        const { choices } = await openai.chat.completions.create({
        model: "gemini-2.0-flash",
        messages: [
        {
            role: "user",
            content: prompt,
        },
    ],
});

      const reply = {...choices[0].message, timestamp:Date.now(), isImage:false }

      res.status(200).json({ success:true, reply })

      chat.messages.push(reply)
      await chat.save()

      await User.updateOne({ _id:userId } , { $inc: { credits:-1 }})


    } catch (error) {
        res.status(500).json({ success:false, message:error.message })
    }
}

export const imageMessageController = async (req,res) => {
    try {
        const userId = req.user._id
        if(req.user.credits < 2) {
            return res.status(400).json({ success:false, message:"You don't have enough credits to use this feature" })
        }
        const { chatId, prompt, isPublished } = req.body;
        const chat = Chat.findOne({ _id:chatId, userId })
        chat.messages.push({ role:"user" , content: prompt, timestamp:Date.now(), isImage:true })
    } catch (error) {
        
    }
}