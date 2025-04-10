import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getLikedVideos, toggleCommentLike, toggleTweetLike, toggleVideoLike } from "../controllers/like.controller.js";

const likeRouter = express.Router();

likeRouter.post('/video/:videoId', verifyJWT, toggleVideoLike);
likeRouter.post('/comment/:commentId', verifyJWT, toggleCommentLike);
likeRouter.post('/tweet/:tweetId', verifyJWT, toggleTweetLike);
likeRouter.get('/all-videos', verifyJWT, getLikedVideos);

export default likeRouter;