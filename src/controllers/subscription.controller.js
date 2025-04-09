import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { SubscriptionModel } from "../models/subscription.model.js"

const toggleSubscription = asyncHandler(async (req, res) => {
    // TODO: toggle subscription
    const { channelId } = req.params
    const subscriberId = req.user?._id

    if (subscriberId.toString() === channelId.toString()) {
        throw new ApiError(400, "You cannot subscribe to yourself");
    }
    
    const alreadySubscribed = await SubscriptionModel.findOne({
        channel: channelId,
        subscriber: subscriberId
    })
    if (alreadySubscribed) {
        await SubscriptionModel.findByIdAndDelete(alreadySubscribed._id)

        return res.status(200).json(new ApiResponse(200, {}, "Unsubscribed successfully"))
    } else {
        const newSubcriber = await SubscriptionModel.create({
            subscriber: subscriberId,
            channel: channelId
        })

        return res.status(200).json(new ApiResponse(201, newSubcriber, "Unsubscribed successfully"))
    }
})

// controller to return subscribers list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params
    const subscribers = await SubscriptionModel.find({ channel: channelId })

    return res.status(200).json(new ApiResponse(200, subscribers, 'Subscribers list'))
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const subscriberId = req.user._id
    const subscribedChannels = await SubscriptionModel.find({ subscriber: subscriberId })
    
    return res.status(200).json(new ApiResponse(200, subscribedChannels, 'Channels list'))
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}