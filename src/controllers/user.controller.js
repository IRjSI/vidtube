import { FriendModel } from "../models/friend.model.js";
import { MessageModel } from "../models/message.model.js";
import UserModel from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await UserModel.findById(userId)
        if (!user) {
            throw new ApiError(404, 'user not found')
        }
    
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
    
        user.refreshToken = refreshToken
        await user.save({ ValidityBeforeSave: false })
    
        return { accessToken, refreshToken };
    } catch (error) {
        console.log(error);
        throw new ApiError(500, 'Error generating token')
    }
}

const registerUser = asyncHandler(async (req,res) => {
    const { username, fullname, password, email } = req.body;
    //images(avatar and coverImage) are not coming through 'body' it is coming from 'req.files', handled with multer
    const existing = await UserModel.findOne({
        $or: [ { username } , { email } ]
    })
    if (existing) {
        throw new ApiError(409, 'user already exists')
    }

    const avatarLocalPath = req.files?.avatar?.[0]?.path
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path

    if (!avatarLocalPath) {
        throw new ApiError(400, 'avatar file is required')
    }

    // send this images on cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = coverImageLocalPath ? await uploadOnCloudinary(coverImageLocalPath) : '';

    const newUser = await UserModel.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || '',
        email,
        password,
        username: username.toLowerCase()
    })
    if (!newUser) {
        throw new ApiError(500, 'Error creating user')
    }

    return res.json(new ApiResponse(201, newUser, 'User registered'))
})

const loginUser = asyncHandler(async (req,res) => {
    const { username, password, email } = req.body;
    
    const user = await UserModel.findOne({
        $or: [{ username }, { email }]
    })
    if (!user) {
        throw new ApiError(404, 'user not found')
    }

    const isMatch = await user.isPasswordCorrect(password)
    if (!isMatch) {
        throw new ApiError(401, 'Invalid creds')
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
    }

    return res.status(200).cookie('accessToken', accessToken, options).cookie('refreshToken', refreshToken, options).json(new ApiResponse(200, user, 'user logged in'))
})

const logoutUser = asyncHandler(async (req,res) => {
    await UserModel.findByIdAndUpdate(
        req.user._id, // since we stored user in req in auth middleware
        {
            $set: {
                refreshToken: ''
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV || "production"
    }

    return res
        .status(200)
        .clearCookie('accessToken', options)
        .clearCookie('refreshToken', options)
        .json(new ApiResponse(200, {}, 'User logged out successfully'))
})

const refreshAccessToken = asyncHandler(async (req,res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
    if (!incomingRefreshToken) {
        throw new ApiError(401, 'Refresh token is required');
    }
    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.JWT_SECRET);
        const user = await UserModel.findById(decodedToken?._id);
        console.log(user)
        if (!user) {
            throw new ApiError(401, 'invalid refresh token');
        }

        if (user?.refreshToken !== incomingRefreshToken) {
            throw new ApiError(401, 'invalid refresh token');
        }

        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV || "production"
        }

        const { accessToken, refreshToken: newRefreshToken } = await generateAccessAndRefreshToken(user._id);

        return res
            .status(200)    
            .cookie('accessToken', accessToken, options)
            .cookie('refreshToken', newRefreshToken, options)   
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken: newRefreshToken },
                    'access token refreshed successfully'
                )
            );
    } catch (error) {
        throw new ApiError(500, 'something went wrong while refreshing token');
    }
})

const updatePassword = asyncHandler(async (req,res) => {
    const { oldPassword, newPassword } = req.body;

    const user = await UserModel.findById(req.user?._id);
    
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
    if (!isPasswordCorrect) {
        throw new ApiError(401, 'Incorrect password')
    }

    user.password = newPassword; // we have implemented hashing in "pre" hook in UserModel
    await user.save({ validateBeforeSave: false });

    return res.status(200).json(new ApiResponse(201, {}, 'Password updated Successfully'))
})

const getUser = asyncHandler(async (req,res) => {
    return res.status(200).json(new ApiResponse(200, req.user, 'user details'))
})

const getUserByQuery = asyncHandler(async (req,res) => {
    const { username } = req.params;
    if (!username) {
        throw new ApiError(400, 'username must be provided')
    }

    const user = await UserModel.find({ username: {$regex: username, $options: "i"} });
    
    if (!user.length) {
        throw new ApiError(404, 'User does not exists')
    }

    return res.status(200).json(new ApiResponse(201, user, 'user found'))
})

const getUserBySearch = asyncHandler(async (req,res) => {
    const { username } = req.body;
    if (!username) {
        throw new ApiError(400, 'username must be provided')
    }

    const user = await UserModel.find({ username: {$regex: username, $options: "i"} });
    
    if (!user.length) {
        throw new ApiError(404, 'User does not exists')
    }

    return res.status(200).json(new ApiResponse(201, user, 'user found'))
})

const updateDetails = asyncHandler(async (req,res) => {
    const { fullname, email } = req.body;
    if (!fullname || !email) {
        throw new ApiError(400, 'fullname and email are required')
    }

    const user = await UserModel.findByIdAndUpdate(
        req.user?._id, 
        {
            $set: {
                fullname,
                email
            }
        },
        { new: true }
    );

    return res.status(200).json(new ApiResponse(200, user, 'Account details updated'))
})

const updateDescription = asyncHandler(async (req,res) => {
    const { oldDescription, newDescription } = req.body;
    if (!oldDescription || !newDescription) {
        throw new ApiError(400, 'oldDescription and newDescription are required')
    }

    const user = await UserModel.findByIdAndUpdate(
        req.user?._id, 
        {
            $set: {
                description: newDescription
            }
        },
        { new: true }
    );

    return res.status(200).json(new ApiResponse(200, user, 'Account details(desc) updated'))
})

const updateAvatar = asyncHandler(async (req,res) => {
    const avatarLocalPath = req.file?.path;
    if (!avatarLocalPath) {
        throw new ApiError(400, 'File is required');
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);

    if (!avatar.url) {
        throw new ApiError(500, 'Something went wrong while uploading avatar')
    }

    const user = await UserModel.findByIdAndUpdate(req.user?._id, {
        $set: {
            avatar: avatar.url
        }
    }, { new: true });

    return res.status(200).json(new ApiResponse(200, user, 'Avatar updated'))
})

const updateCoverImage = asyncHandler(async (req,res) => {
    const coverImageLocalPath = req.file?.path;
    if (!coverImageLocalPath) {
        throw new ApiError(400, 'File is required');
    }

    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if (!coverImage.url) {
        throw new ApiError(500, 'Something went wrong while uploading avatar')
    }

    const user = await UserModel.findByIdAndUpdate(req.user?._id, {
        $set: {
            coverImage: coverImage.url
        }
    }, { new: true });

    return res.status(200).json(new ApiResponse(200, user, 'cover Image updated'))
})

const addFriend = asyncHandler(async (req,res) => {
    const { friendId } = req.params
    const userId = req.user?._id

    if (userId.toString() === friendId.toString()) {
        return res.json(new ApiResponse(201, {}, "can't add yourself"))
    }

    const alreadyFriend = await FriendModel.findOne({
        friend: friendId,
        user: userId
    })
    if (alreadyFriend) {
        const remove = await FriendModel.findByIdAndDelete(alreadyFriend._id)

        return res.status(200).json(new ApiResponse(200, remove, "removed successfully"))
    } else {
        const newFriend = await FriendModel.create({
            friend: friendId,
            user: userId
        })
        
        return res.status(200).json(new ApiResponse(201, newFriend, "added successfully"))
    }
})

const friendStatus = asyncHandler(async (req,res) => {
    const { friendId } = req.params
    const userId = req.user?._id

    const alreadyFriend = await FriendModel.findOne({
        friend: friendId,
        user: userId
    })

    if (alreadyFriend) {
        return res.status(200).json(new ApiResponse(201, { message: true }, "Added"))
    } else {
        return res.status(200).json(new ApiResponse(201, { message: false }, "removed"))
    }
})

const getFriends = asyncHandler(async (req, res) => {
    const userId = req.user._id
    const friends = await FriendModel.aggregate([
        {
            "$match": {
                "user": userId
            }
        },
        {
            "$lookup": {
                "from": "users",
                "localField": "friend",
                "foreignField": "_id",
                "as": "user"
            }
        },
        {
            "$project": {
                "user._id": 1,
                "user.username": 1,
                "user.avatar": 1
            }
        }
    ])
    
    return res.status(200).json(new ApiResponse(200, friends, 'friends list'))
})


const getMessages = asyncHandler(async (req, res) => {
    const { roomId } = req.params
    
    const messages = await MessageModel.find({ room: roomId }).sort({ createdAt: 1 });
    if (!messages) {
        return res.json(new ApiResponse(404, 'messages not found'))
    }

    return res.json(new ApiResponse(200, messages, 'messages found'))
})

export { registerUser, loginUser, logoutUser, refreshAccessToken, updateCoverImage, updateAvatar, updateDetails, getUser, updatePassword, getUserByQuery, getUserBySearch, addFriend, friendStatus, getFriends, getMessages, updateDescription };