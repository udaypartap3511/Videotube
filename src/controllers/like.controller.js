import mongoose,{isValidObjectId} from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {Like} from "../models/like.models.js"
import {Comment} from "../models/comment.models.js"
import { Video } from "../models/video.models.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    //TODO: toggle like on video

    if(!videoId){
        throw new ApiError(400,"videoId is missing")
    }

    if(!isValidObjectId(videoId)){
        throw new ApiError(400,"Invalid videoId")
    }

    const video = await Video.findById(videoId)

    if (!video) {
        throw new ApiError(404, "Video not found")
    }

    const liked= await Like.findOneAndDelete(
        {
            video:videoId,
            likedBy:req.user?._id
        }
    )

    if(liked){
        return res
        .status(200)
        .json(new ApiResponse(200,liked,"video Unliked"))
    }

    const like= await Like.create(
        {
            video:videoId,
            likedBy:req.user?._id
        }
    )

    return res
    .status(201)
    .json(new ApiResponse(201,like,"video liked"))
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment

    if(!commentId){
        throw new ApiError(400,"commentId is missing")
    }

    if(!isValidObjectId(commentId)){
        throw new ApiError(400,"Invalid commentId")
    }

    const comment = await Comment.findById(commentId)

    if (!comment) {
        throw new ApiError(404, "comment not found")
    }

    const liked= await Like.findOneAndDelete(
        {
            comment:commentId,
            likedBy:req.user?._id
        }
    )

    if(liked){
        return res
        .status(200)
        .json(new ApiResponse(200,liked,"comment Unliked"))
    }

    const like= await Like.create(
        {
            comment:commentId,
            likedBy:req.user?._id
        }
    )

    return res
    .status(201)
    .json(new ApiResponse(201,like,"comment liked"))

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet

    if(!tweetId){
        throw new ApiError(400,"tweetId is missing")
    }

    if(!isValidObjectId(tweetId)){
        throw new ApiError(400,"Invalid tweetId")
    }

    const tweet = await Tweet.findById(tweetId)

    if (!tweet) {
        throw new ApiError(404, "tweet not found")
    }

    const liked= await Like.findOneAndDelete(
        {
            tweet:tweetId,
            likedBy:req.user?._id
        }
    )

    if(liked){
        return res
        .status(200)
        .json(new ApiResponse(200,liked,"tweet Unliked"))
    }

    const like= await Like.create(
        {
            tweet:tweetId,
            likedBy:req.user?._id
        }
    )

    return res
    .status(201)
    .json(new ApiResponse(201,like,"tweet liked"))
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos

    const likedVideos= await Like.find(
        {
            likedBy:req.user?._id,
            video:{$exists: true}
        }
    ).populate("video","videoFile thumbnail title duration")

    if(likedVideos.length===0){
        throw new ApiError(404,"no liked Video found")
    }

    return res
    .status(200)
    .json(new ApiResponse(200,likedVideos,"liked Videos fetched successfully"))
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}