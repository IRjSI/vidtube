import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    getLikedVideos,
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    videoLikeStatus
} from "../controllers/like.controller.js";

const likeRouter = express.Router();

likeRouter.use(verifyJWT);

likeRouter.post('/video/:videoId', toggleVideoLike);
likeRouter.get('/video-status/:videoId', videoLikeStatus);
likeRouter.post('/comment/:commentId', toggleCommentLike);
likeRouter.post('/tweet/:tweetId', toggleTweetLike);
likeRouter.get('/all-videos', getLikedVideos);

export default likeRouter;