import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.models.js";
import {Video} from "../models/video.models.js";
import {User} from "../models/user.models.js";
import { Subscription } from "../models/subscription.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.

    const {channelId}= req.params

    if(!channelId){
        throw new ApiError(400,"channelId is missing")
    }

    if(!isValidObjectId(channelId)){
        throw new ApiError(400,"Invalid channel Id")
    }
    
    const data={}

    const resultviews= await Video.aggregate([
        {
            $match:{
                owner:new mongoose.Types.ObjectId(channelId)
            }
        },
        {
            $group:{
                _id:null,
                totalViews:{
                    $sum:"$views"
                }
            }
        }
    ])
     
    data.totalViews= resultviews.length>0?resultviews[0].totalViews:0

    const resultSubscribers= await Subscription.aggregate([
        {
            $match:{
                channel:new mongoose.Types.ObjectId(channelId)
            }
        },
        {
            $group:{
                _id:null,
                totalSubscribers:{
                    $sum:1
                }
            }
        }
    ])

    data.totalSubscribers= resultSubscribers.length>0?resultSubscribers[0].totalSubscribers:0

    const resultvideos= await Video.aggregate([
        {
            $match:{
                owner:new mongoose.Types.ObjectId(channelId)
            }
        },
        {
            $group:{
                _id:null,
                totalVideos:{
                    $sum:1
                }
            }
        }
    ])
     
    data.totalVideos= resultvideos.length>0?resultvideos[0].totalVideos:0

    const resultlikes= await Video.aggregate([
        {
            $match:{
                owner:new mongoose.Types.ObjectId(channelId)
            }
        },
        {
            $lookup:{
                from:"likes",
                localField:"_id",
                foreignField:"video",
                as:"likes"
            }
        },
        {
            $addFields:{
                totalLikes:{
                    $size:"$likes"
                }
            }
        },
        {
            $group:{
                _id:null,
                totalLikes:{
                    $sum:"$totalLikes"
                }
            }
        }
    ])
     
    data.totalLikes= resultlikes.length>0?resultlikes[0].totalLikes:0

    return res
    .status(200)
    .json(new ApiResponse(200,data,"channel stats fetched successfully"))

})

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel

    const {channelId}= req.params

    if(!channelId){
        throw new ApiError(400,"channelId is missing")
    }

    if(!isValidObjectId(channelId)){
        throw new ApiError(400,"Invalid channelId")
    }

    const videos= await Video.find({
        owner:channelId
    })

    if(videos.length===0){
        throw new ApiError(404,"no video found")
    }

    return res
    .status(200)
    .json(new ApiResponse(200,videos,"channel videos fetched successfully"))
})

export {
    getChannelStats, 
    getChannelVideos
    }