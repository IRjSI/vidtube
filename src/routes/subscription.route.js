import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels,
    getSubscribeStatus
} from "../controllers/subscription.controller.js";

const subscriptionRouter = express.Router();

subscriptionRouter.get('/get-channels', getSubscribedChannels);

subscriptionRouter.use(verifyJWT);

subscriptionRouter.patch('/toggle/:channelId', toggleSubscription);
subscriptionRouter.get('/get-subscribers', getUserChannelSubscribers);
subscriptionRouter.get('/get-status/:channelId', getSubscribeStatus);

export default subscriptionRouter;