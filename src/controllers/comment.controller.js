import mongoose,{isValidObjectId} from "mongoose";
import { Comment } from "../models/comment.models.js";
import { Video } from "../models/video.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";


const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query

    if(Number(page)<1 || Number(limit)<1){
        throw new ApiError(400,"page or limit is less than one")
    }

    const skip = (Number(page)-1)*Number(limit)

    if(!videoId){
        throw new ApiError(400,"videoId is missing")
    }

    if(!isValidObjectId(videoId)){
        throw new ApiError(400,"Invalid videoId")
    }

    const comments = await Comment.find(
        {
            video:videoId
        }
    ).populate("owner", "username fullname avatar")
     .limit(Number(limit))
     .skip(skip)
     .sort({createdAt: -1})

    if(comments.length===0){
        throw new ApiError(404,"No comment found")
    }

    return res
    .status(200)
    .json( new ApiResponse(200,comments,"comments fetched successfully"))

})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video

    const {videoId}= req.params
    const {content}= req.body

    if(!videoId){
       throw new ApiError(400,"videoId is missing")
    }

    if(!isValidObjectId(videoId)){
        throw new ApiError(400,"videoId is Invalid")
    }
    
    if(!content || !content.trim()){
        throw new ApiError(400,"content is required")
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    const comment= await Comment.create(
        {
            content,
            video:videoId,
            owner:req.user?._id
        }
    )

    return res
    .status(201)
    .json(new ApiResponse(201,comment,"comment added successfully"))


})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const {commentId} = req.params
    const {content} = req.body

    if(!content || !content.trim()){
        throw new ApiError(400,"content is required")
    }

    if(!commentId){
        throw new ApiError(400,"comment Id is missing")
    }

    if(!isValidObjectId(commentId)){
        throw new ApiError(400,"Invalid comment Id")
    }

    const comment= await Comment.findOneAndUpdate(
        {
            _id:commentId,
            owner:req.user?._id
        },
        {
            $set:{
                content
            }
        },
        {
            new : true
        }
    )

    if(!comment){
        throw new ApiError(404,"comment not found")
    }

    return res
    .status(200)
    .json(new ApiResponse(200,comment,"comment updated successfully"))
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment

    const {commentId}= req.params

    if(!commentId){
        throw new ApiError(400,"comment Id is missing")
    }

    if(!isValidObjectId(commentId)){
        throw new ApiError(400,"Invalid commentId")
    }

    const comment = await Comment.findOneAndDelete(
        {
            _id:commentId,
            owner:req.user?._id
        }
    )

    if(!comment){
        throw new ApiError(404,"comment not found")
    }

    return res
    .status(200)
    .json(new ApiResponse(200,comment,"comment deleted successfully"))
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
}