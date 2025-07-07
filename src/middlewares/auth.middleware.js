import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import UserModel from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req,res,next) => {
    const token = req.cookies.accessToken || req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        throw new ApiError(401, 'Unauth')
    }
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        
        const user = await UserModel.findById(decodedToken?._id);
        if (!user) {
            throw new ApiError(401, 'unautho')
        }        

        req.user = user;
        next()
    } catch (error) {
        console.log(error);
        throw new ApiError(500, 'something went wrong(auth middleware)')
    }
}) 