import mongoose,{isValidObjectId} from "mongoose";
import {Tweet} from "../models/tweet.models.js";
import { User } from "../models/user.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet

    const {content}= req.body;

    if(!content){
        throw new ApiError(400,"Tweet content is required")
    }

    const tweet = await Tweet.create({
        owner:req.user?._id,
        content
    })


    return res
    .status(201)
    .json(new ApiResponse(201,tweet,"Tweet Created Successfuly"))

})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    const tweets= await Tweet.find(
        {
            owner:req.user?._id
        }
    )

    if(!tweets || tweets.length==0){
        throw new ApiError(404,"No Tweets Found")
    }

    return res
    .status(200)
    .json(new ApiResponse(200,tweets,"tweets fetched successfully"))


})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const {tweetId} = req.params
    
    const {content} = req.body

    if(!content){
        throw new ApiError(400,"no content to update")
    }

    if(!tweetId){
        throw new ApiError(400,"No tweet Id found")
    }

    if(!isValidObjectId(tweetId)){
        throw new ApiError(400,"Invalid tweet ID")
    }

    const tweet= await Tweet.findOneAndUpdate(
        {
           owner:req.user?._id,
           _id:tweetId
        },
        {
           $set:{
              content
           }
        },
        {new:true}
    )

    if(!tweet){
        throw new ApiError(404,"Tweet not found")
    }

    return res
    .status(200)
    .json(new ApiResponse(200,tweet,"tweet updated successfully"))
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet

    const {tweetId} = req.params

    if(!tweetId){
        throw new ApiError(400,"tweetId not found")
    }

    if(!isValidObjectId(tweetId)){
        throw new ApiError(400,"Invalid tweetID")
    }

    const tweet= await Tweet.findOneAndDelete(
        {
            _id:tweetId,
            owner:req.user?._id
        }
    )

    if(!tweet){
        throw new ApiError(404,"No tweet found")
    }

    return res
    .status(200)
    .json(new ApiResponse(200,tweet,"tweet deleted successfully"))

})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}