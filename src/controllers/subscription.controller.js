import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { SubscriptionModel } from "../models/subscription.model.js"
import UserModel from "../models/user.model.js"

const toggleSubscription = asyncHandler(async (req, res) => {
    // TODO: toggle subscription
    const { channelId } = req.params
    const subscriberId = req.user?._id

    if (subscriberId.toString() === channelId.toString()) {
        return res.json(new ApiResponse(201, {}, "can't subscribe yourself"))
    }

    const alreadySubscribed = await SubscriptionModel.findOne({
        channel: channelId,
        subscriber: subscriberId
    })
    if (alreadySubscribed) {
        const unsubscribed = await SubscriptionModel.findByIdAndDelete(alreadySubscribed._id)

        return res.status(200).json(new ApiResponse(200, unsubscribed, "Unsubscribed successfully"))
    } else {
        const newSubcriber = await SubscriptionModel.create({
            channel: channelId,
            subscriber: subscriberId
        })
        
        return res.status(200).json(new ApiResponse(201, newSubcriber, "Subscribed successfully"))
    }
})

// controller to return subscribers list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const channelId = req.user._id
    const subscribers = await SubscriptionModel.find({ channel: channelId })

    return res.status(200).json(new ApiResponse(200, subscribers, 'Subscribers list'))
})

const getSubscribeStatus = asyncHandler(async (req,res) => {
    const { channelId } = req.params
    const subscriberId = req.user?._id

    const alreadySubscribed = await SubscriptionModel.findOne({
        channel: channelId,
        subscriber: subscriberId
    })

    if (alreadySubscribed) {
        return res.status(200).json(new ApiResponse(201, { message: true }, "Subscribed"))
    } else {
        return res.status(200).json(new ApiResponse(201, { message: false }, "Not subscribed"))
    }
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const subscriberId = req.user._id
    const subscribedChannels = await SubscriptionModel.aggregate([
        {
            "$match": {
                "subscriber": subscriberId
            }
        },
        {
            "$lookup": {
                "from": "users",
                "localField": "channel",
                "foreignField": "_id",
                "as": "user"
            }
        },
        {
            "$project": {
                "user.username": 1,
                "user.avatar": 1
            }
        }
    ])
    
    return res.status(200).json(new ApiResponse(200, subscribedChannels, 'Channels list'))
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels,
    getSubscribeStatus
}