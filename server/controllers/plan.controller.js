import Transaction from "../models/transaction.model.js"
import Stripe from 'stripe'
const plans = [
    {
        _id: "basic",
        name: "Basic",
        price: 10,
        credits: 100,
        features: ['100 text generations', '50 image generations', 'Standard support', 'Access to basic models']
    },
    {
        _id: "pro",
        name: "Pro",
        price: 20,
        credits: 500,
        features: ['500 text generations', '200 image generations', 'Priority support', 'Access to pro models', 'Faster response time']
    },
    {
        _id: "premium",
        name: "Premium",
        price: 30,
        credits: 1000,
        features: ['1000 text generations', '500 image generations', '24/7 VIP support', 'Access to premium models', 'Dedicated account manager']
    }
]

// getting all plans
export const gettingAllPlans = async (req,res) => {
    try {
        res.status(200).json({ success:true, plans })
    } catch (error) {
        res.status(500).json({ success:false, message:error.message })
    }
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// purchasing a plan

export const purchasePlan = async (req,res) => {
    try {
        const { planId } = req.body;
        const userId = req.user._id;
        const plan = plans.find(plan => plan._id === planId)
        if(!plan){
            return res.status(400).json({ success:true, message:"Plan Not Available!" })
        }
        const transaction = await Transaction.create({
            userId,
            planId,
            amount:plan.price,
            credits:plan.credits,
            isPaid:false
        })
        
        const origin = req.headers.origin || process.env.CLIENT_URL || "http://localhost:3000"
        const session = await stripe.checkout.sessions.create({
            line_items:[
                {
                    price_data:{
                        currency:"usd",
                        unit_amount:plan.price * 100,
                        product_data:{
                            name:plan.name,
                        }
                    },
                    quantity:1,
                }
            ],
            mode:'payment',
            success_url:`${origin}/loading`,
            cancel_url:`${origin}`,
            metadata: { transactionId: transaction._id.toString(), appId: 'Quickgpt' } 
        })

        res.status(200).json({ success:true, url:session.url })

    } catch (error) {
        res.status(500).json({ success:false, message:error.message })   
    }
}

