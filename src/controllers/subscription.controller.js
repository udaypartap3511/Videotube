import mongoose,{isValidObjectId} from "mongoose";
import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import { Subscription } from "../models/subscription.models.js";
import {User} from "../models/user.models.js";



const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    // TODO: toggle subscription

    if(!channelId){
        throw new ApiError(400,"no channelId present")
    }

    if(!isValidObjectId(channelId)){
        throw new ApiError(400,"Invalid channelId")
    }


    const subscriptionDelete= await Subscription.findOneAndDelete(
        {
            subscriber:req.user?._id,
            channel:channelId
        }
    )

    if(subscriptionDelete){

        return res
        .status(200)
        .json(new ApiResponse(200,subscriptionDelete,"subscription toggled successfully"))
    }

    const subsciptionStart= await Subscription.create({
        subscriber:req.user?._id,
        channel:channelId
    })
    
    return res
    .status(201)
    .json(new ApiResponse(201,subsciptionStart,"subscription toggled successfully"))

})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params

    if(!channelId){
        throw new ApiError(400,"channelId not present")
    }

    if(!isValidObjectId(channelId)){
        throw new ApiError(400,"Invalid Channel ID")
    }

    const subscribers= await Subscription.find(
        {
            channel:channelId
        }
    ).populate("subscriber","username fullname avatar")

    return res
    .status(200)
    .json(new ApiResponse(200,subscribers,"subscribers fetched successfully"))
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params

    if(!subscriberId){
        throw new ApiError(400,"subscriberID is missing")
    }

    if(!isValidObjectId(subscriberId)){
      throw new ApiError(400,"Invalid subscriberId")
    }

    const channels = await Subscription.find(
        {
            subscriber:subscriberId
        }
    ).populate("channel","username fullname avatar")


    return res
    .status(200)
    .json(new ApiResponse(200,channels,"channels fetched successfully"))
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}


