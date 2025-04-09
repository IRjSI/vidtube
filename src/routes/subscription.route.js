import express from "express";
import { getSubscribedChannels, getUserChannelSubscribers, toggleSubscription } from "../controllers/subscription.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const subscriptionRouter = express.Router();

subscriptionRouter.get('/get-subscribers/:channelId', verifyJWT, getUserChannelSubscribers);
subscriptionRouter.get('/get-channels/:subscriberId', verifyJWT, getSubscribedChannels);
subscriptionRouter.patch('/toggle/:channelId', verifyJWT, toggleSubscription);

export default subscriptionRouter;