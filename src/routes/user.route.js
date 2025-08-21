import express from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { 
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    updateAvatar,
    updateCoverImage,
    updateDescription,
    updateDetails,
    updatePassword,
    getUser,
    getUserByQuery,
    getUserBySearch,
    getFriends,
    addFriend,
    friendStatus,
    getMessages
} from "../controllers/user.controller.js";

const userRouter = express.Router();

// authentication routes
userRouter.post('/register', upload.fields([
    {
        name: "avatar",
        maxCount: 1
    },
    {
        name: "coverImage",
        maxCount: 1
    }
]), registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/logout', verifyJWT, logoutUser);
userRouter.post('/refresh-token', refreshAccessToken);

// middleware for all routes
userRouter.use(verifyJWT);

// profile routes
userRouter.get('/get-user', getUser);
userRouter.get('/get-user-search/:username', getUserByQuery);
userRouter.get('/get-user-by-search', getUserBySearch);

// profile updation routes
userRouter.post('/update-details', updateDetails);
userRouter.patch('/update-details', updateDetails);
userRouter.patch('/update-description', updateDescription);
userRouter.patch('/update-avatar', upload.single('avatar'), updateAvatar);
userRouter.patch('/update-cover-image', upload.single('coverImage'), updateCoverImage);
userRouter.post('/change-password', updatePassword);

// chat-app routes
userRouter.patch('/add-friend/:friendId', addFriend);
userRouter.get('/get-friend-status/:friendId', friendStatus);
userRouter.get('/get-friends', getFriends);
userRouter.get('/get-messages/:roomId', getMessages);

export default userRouter;