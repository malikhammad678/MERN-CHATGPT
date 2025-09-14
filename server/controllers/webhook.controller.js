import Stripe from "stripe";
import Transaction from "../models/transaction.model.js";
import User from "../models/user.model.js";

export const stripeWebhooks = async (request,response) => {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
    const sig = request.headers['stripe-signature']

    let event;
    try {
        event = stripe.webhooks.constructEvent(request.body, sig, process.env.STRIPE_WEBHOOK_SECRET)
    } catch (error) {
        response.status(400).send(`Webhook error : ${error.message}`)
    }

    try {
        switch (event.type) {
            case 'payment_intend.succeeded': {
                const paymentIntent = event.data.object
                const sessionList = await stripe.checkout.sessions.list({
                    payment_intent: paymentIntent.id,
                })
                const session = sessionList.data[0]
                const { transactionId, appId } = session.metadata

                if(appId === 'Quickgpt') {
                    const transaction = await Transaction.findOne({ _id: transactionId, isPaid:false })
                    // update credits
                    await User.updateOne({ _id: transaction.userId }, { $inc: { credits:transaction.credits } })

                    // update credit payment status
                    transaction.isPaid = true
                    await transaction.save()
                } else {
                    return response.json({ received:true, message:"Ignored event: Invalid app" })
                }
                 break;
            }
            default:
                console.log("Unhandled event type:", event.type)
                break;
        }
        response.json({ received:true })
    } catch (error) {
        response.status(500).send({ success:false, message:error.message })
    }
}