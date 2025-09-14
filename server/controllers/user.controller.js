import { generateToken } from "../config/generateToken.js";
import Chat from "../models/chat.model.js";
import User from "../models/user.model.js";
import bcrypt from 'bcryptjs'

export const signup = async (req,res) => {
    try {
        const { name , email , password } = req.body;
        if(!email || !name || !password) {
            return res.status(400).json({ success:false, message:'Please fill in all fields!' })
        }
        const existUser = await User.findOne({ email })
        if(existUser){
            return res.status(400).json({ success:false, message:'User Already Exist!' })
        }
        const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if(!strongPasswordRegex.test(password)){
            return res.status(400).json({
        message:
          "Password must be at least 8 characters long, include uppercase, lowercase, number, and special character",
      });
        }
        const hashedPassword = await bcrypt.hash(password,10)

        const user = await User.create({
            name,
            email,
            password:hashedPassword
        })

        const token = await generateToken(user._id)

        res.status(201).json({
            success:true,
            message:'User Registered!',
            user,
            token
        })


    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            success:false,
            message:'Internal Server Error'
        })
    }
}

export const login = async (req,res) => {
    try {
        const { email, password } = req.body;
        if(!email || !password){
            return res.status(400).json({ success:false, message:'Please fill in all fields!' })
        }
        const user = await User.findOne({ email })
        if(!user){
            return res.status(400).json({ success:false, message:'Invalid Credentials!' })
        }
        if(password){
            const checkPassword = await bcrypt.compare(password, user.password)
            if(!checkPassword){
              return res.status(400).json({ success:false, message:'Invalid Credentials!' })
            }
        }
        
        const token = await generateToken(user._id)

        res.status(200).json({
            success:true,
            message:'Welcome Back',
            user,
            token
        })

    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            success:false,
            message:'Internal Server Error'
        })
    }
}

export const getUser = async (req,res) => {
    try {
        res.status(200).json({ success:true, user:req.user })
    } catch (error) {
         console.log(error.message)
        res.status(500).json({
            success:false,
            message:'Internal Server Error'
        })
    }
}

export const getPublishedImages = async (req,res) => {
    try {
        const publishedImages = await Chat.aggregate([
            {$unwind: "$messages"},
            {
                $match:{
                    "messages.isImage":true,
                    "messages.isPublished":true
                },
            },
            {
                $project:{
                    _id:0,
                    imageUrl:"$messages.content",
                    userName:"$userName"
                }
            }
        ])
        res.status(200).json({ success:true, images: publishedImages.reverse() })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            success:false,
            message:'Internal Server Error'
        })
    }
}