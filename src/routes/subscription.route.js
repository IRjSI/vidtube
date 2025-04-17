import express from "express";
import { getSubscribedChannels, getSubscribeStatus, getUserChannelSubscribers, toggleSubscription } from "../controllers/subscription.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const subscriptionRouter = express.Router();

subscriptionRouter.get('/get-subscribers', verifyJWT, getUserChannelSubscribers);
subscriptionRouter.get('/get-channels', verifyJWT, getSubscribedChannels);
subscriptionRouter.patch('/toggle/:channelId', verifyJWT, toggleSubscription);
subscriptionRouter.get('/get-status/:channelId', verifyJWT, getSubscribeStatus);

export default subscriptionRouter;