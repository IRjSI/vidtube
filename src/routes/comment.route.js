import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addComment, deleteComment, getVideoComments, updateComment } from "../controllers/comment.controller.js";

const commentRouter = express.Router();

commentRouter.post('/add/:videoId', verifyJWT, addComment);
commentRouter.patch('/update/:commentId', verifyJWT, updateComment);
commentRouter.patch('/delete/:commentId', verifyJWT, deleteComment);
commentRouter.get('/all-comments/:videoId', verifyJWT, getVideoComments);

export default commentRouter;