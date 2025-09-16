import Stripe from "stripe";
import Transaction from "../models/transaction.model.js";
import User from "../models/user.model.js";

export const stripeWebhooks = async (request,response) => {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
    const sig = request.headers["stripe-signature"]
    let event;
    try {
        event = stripe.webhooks.constructEvent(request.body, sig, process.env.STRIPE_WEBHOOK_SECRET)
    } catch (error) {
        return response.status(500).send(`Webhook error: ${error.message}`)
    }

    try {
        switch (event.type) {
            case "payment_intent.succeeded":{
                const paymenIntent = event.data.object
                const sessionList = await stripe.checkout.sessions.list({
                    payment_intent: paymenIntent.id
                })
                const session = sessionList.data[0];
                const { transactionId, appId } = session.metadata;

                if(appId === 'quickgpt'){
                    const transaction = await Transaction.findOne({ _id:transactionId, isPaid:false })
                    await User.updateOne({ _id:transaction.userId }, {$inc: { credits:transaction.credits }})
                    transaction.isPaid = true;
                    await transaction.save()
                } else {
                    return response.json({ received:true, message:"Ignored event: Invalid App" })
                }
                break;
            }
            default:
                console.log("Unhandled event type:", event.type)
                break;
        }
        response.json({ received:true })
    } catch (error) {
        console.error("webhook processing error:", error)
        response.status(500).send("Internal Server error")
    }
}