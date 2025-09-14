import express from 'express'
import { gettingAllPlans, purchasePlan } from '../controllers/plan.controller.js'
import { protectedRoute } from '../middleware/protectedroute.js';

const planRouter = express.Router()

planRouter.get("/", gettingAllPlans);
planRouter.post("/purchase", protectedRoute, purchasePlan)

export default planRouter;