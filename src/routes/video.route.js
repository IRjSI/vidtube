import express from "express";
import { deleteVideo, getAllVideos, getVideoById, publishAVideo, togglePublishStatus, updateVideo } from "../controllers/video.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const videoRouter = express.Router();

videoRouter.get('/get-videos', verifyJWT, getAllVideos);
videoRouter.post('/upload-video', verifyJWT, upload.fields([
    {
        name: "video",
        maxCount: 1
    }, 
    {
        name: "thumbnail",
        maxCount: 1
    }
]), publishAVideo);
videoRouter.get('/get-video/:videoId', verifyJWT, getVideoById);
videoRouter.patch('/update-video/:videoId', verifyJWT, upload.single('thumbnail'), updateVideo);
videoRouter.delete('/delete-video/:videoId', verifyJWT, deleteVideo);
videoRouter.patch('/publish/:videoId', verifyJWT, togglePublishStatus);

export default videoRouter;