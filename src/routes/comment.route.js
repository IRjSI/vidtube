import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    addComment,
    getVideoComments,
    updateComment,
    deleteComment
} from "../controllers/comment.controller.js";

const commentRouter = express.Router();

commentRouter.use(verifyJWT);

commentRouter.post('/add/:videoId', addComment);
commentRouter.get('/all-comments/:videoId', getVideoComments);
commentRouter.patch('/update/:commentId', updateComment);
commentRouter.patch('/delete/:commentId', deleteComment);

export default commentRouter;