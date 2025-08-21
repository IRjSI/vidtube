import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    createTweet,
    getAllTweets,
    getUserTweets,
    updateTweet,
    deleteTweet
} from "../controllers/tweet.controller.js";

const tweetRouter = express.Router();

tweetRouter.use(verifyJWT);

tweetRouter.post('/create', createTweet);
tweetRouter.get('/get-all-tweets', getAllTweets);
tweetRouter.get('/get-user-tweets', getUserTweets);
tweetRouter.patch('/update/:tweetId', updateTweet);
tweetRouter.delete('/delete/:tweetId', deleteTweet);

export default tweetRouter;