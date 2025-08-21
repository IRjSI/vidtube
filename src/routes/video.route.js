import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
    addView,
    deleteVideo,
    getAllVideos,
    getMyVideos,
    getVideoById,
    publishAVideo,
    togglePublishStatus,
    updateVideo
} from "../controllers/video.controller.js";

const videoRouter = express.Router();

// middleware for all routes
videoRouter.use(verifyJWT);

videoRouter.post('/upload-video', upload.fields([
    {
        name: "video",
        maxCount: 1
    }, 
    {
        name: "thumbnail",
        maxCount: 1
    }
]), publishAVideo);
videoRouter.get('/get-videos', getAllVideos);
videoRouter.get('/get-my-videos', getMyVideos);
videoRouter.get('/get-video/:videoId', getVideoById);
videoRouter.patch('/update-video/:videoId', upload.single('thumbnail'), updateVideo);
videoRouter.delete('/delete-video/:videoId', deleteVideo);
videoRouter.patch('/publish/:videoId', togglePublishStatus);

videoRouter.patch('/inc-view/:videoId', addView);

export default videoRouter;