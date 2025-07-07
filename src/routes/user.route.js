import express from "express";
import { addFriend, addMessage, deleteMessage, friendStatus, getFriends, getMessages, getUser, getUserByQuery, getUserBySearch, loginUser, logoutUser, refreshAccessToken, registerUser, updateAvatar, updateCoverImage, updateDetails, updateMessage, updatePassword } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const userRouter = express.Router();

// we also want avatar and coverImage
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
userRouter.post('/refresh-token', refreshAccessToken);

userRouter.post('/logout', verifyJWT, logoutUser);
userRouter.post('/change-password', verifyJWT, updatePassword);
userRouter.get('/get-user', verifyJWT, getUser);
userRouter.get('/get-user-search/:username', verifyJWT, getUserByQuery);
userRouter.get('/get-user-by-search', verifyJWT, getUserBySearch);
userRouter.patch('/add-friend/:friendId', verifyJWT, addFriend);
userRouter.get('/get-friend-status/:friendId', verifyJWT, friendStatus);
userRouter.get('/get-friends', verifyJWT, getFriends);
userRouter.post('/update-details', verifyJWT, updateDetails);
userRouter.patch('/update-details', verifyJWT, updateDetails);
userRouter.patch('/update-avatar', verifyJWT, upload.single('avatar'), updateAvatar);
userRouter.patch('/update-cover-image', verifyJWT, upload.single('coverImage'), updateCoverImage);

// userRouter.post('/add-message/:friendId', verifyJWT, addMessage);
// userRouter.patch('/update-message/:messageId', verifyJWT, updateMessage);
// userRouter.patch('/delete-message/:messageId', verifyJWT, deleteMessage);
userRouter.get('/get-messages/:roomId', verifyJWT, getMessages);

export default userRouter;