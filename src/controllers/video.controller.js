import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import {Video} from "../models/video.models.js";
import { User } from "../models/user.models.js";

const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination

    if(userId && mongoose.isValidObjectId(userId)){
        throw new ApiError(400,"Invalid UserId")
    }

    if(Number(page)<1 || Number(limit)<1){
        throw new ApiError(401,"page and limit must be positive number")
    }

    const filter= {};

    if(userId){
        filter.owner=userId
    }

    if(query){
        filter.$or=[
            {title:{$regex:query,$options:"i"}},
            {description: {$regex:query,$options:"i"}}
        ]
    }

    const sort={}
    sort[sortBy]= sortType==="asc"?1:-1

    const skip= (Number(page)-1)* Number(limit)

    const videos= await Video.find(filter)
                             .skip(skip)
                             .sort(sort)
                             .limit(Number(limit))
    

    return res
    .status(200)
    .json(new ApiResponse(200,videos,"videos fetched successfully"))


})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body
    // TODO: get video, upload to cloudinary, create video

    if(!title || !description){
        throw new ApiError(401,"title or description is missing")
    }

    const videoLocalPath = req.files?.videoFile?.[0]?.path

    if(!videoLocalPath){
        throw new ApiError(400,"video file is missing")
    }

    const videoFile= await uploadOnCloudinary(videoLocalPath)

    if(!videoFile.url){
        throw new ApiError(500,"Error while uploading Video File")
    }

    const thumbnailLocalPath= req.files?.thumbnail?.[0]?.path

    if(!thumbnailLocalPath){
        throw new ApiError(400,"Thumbnail is missing")
    }
    
    const thumbnail= await uploadOnCloudinary(thumbnailLocalPath)

    if(!thumbnail.url){
        throw new ApiError(500,"Error while uploading thumbnail")
    }

    const owner= req.user?._id

    const video= await Video.create(
        {
            videoFile:videoFile.url,
            thumbnail:thumbnail.url,
            owner,
            title,
            description,
            duration: videoFile.duration
        }
    )

    return res
    .status(200)
    .json(new ApiResponse(200,video,"video created successfully"))
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
    if(!videoId){
        throw new ApiError(400,"videoId is missing")
    }

    if(!mongoose.isValidObjectId(videoId)){
        throw new ApiError(400,"Invalid videoId");
    }

    const video= await Video.findById(videoId)

    if(!video){
        throw new ApiError(404,"videoFile not found");
    }

    return res
    .status(200)
    .json(new ApiResponse(200,video,"video fetched successfully"))
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail

    if(!videoId){
        throw new ApiError(400,"videoID is missing");
    }

    if(!mongoose.isValidObjectId(videoId)){
        throw new ApiError(400,"Invalid videoId")
    }

    const updateDetails={}
    
    const {title,description}= req.body;

    if(title){
        updateDetails.title=title;
    }

    if(description){
        updateDetails.description=description;
    }


    const thumbnailLocalPath= req.file?.path;

    if(thumbnailLocalPath){
       const thumbnail= await uploadOnCloudinary(thumbnailLocalPath);

       if(!thumbnail.url){
        throw new ApiError(500,"Error while uploading thumbnail file")
       }

       updateDetails.thumbnail=thumbnail.url;
    }



    const video= await Video.findOneAndUpdate(
        {
           _id: videoId,
           owner:req.user?._id
        },
        {
            $set:updateDetails
        },
        {new :true}
    )

    if(!video){
        throw new ApiError(404,"video not found")
    }

    return res
    .status(200)
    .json(new ApiResponse(200,video,"video details updated successfully"))

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video

    if(!videoId){
        throw new ApiError(400,"videoId is missing")
    }

    if(!mongoose.isValidObjectId(videoId)){
        throw new ApiError(400,"Invalid videoID")
    }

    const video=await Video.findOneAndDelete(
        {
            _id:videoId,
            owner:req.user?._id
        });

    if(!video){
        throw new ApiError(404,"video not found");
    }

    return res
    .status(200)
    .json(new ApiResponse(200,"video deleted successfully"));
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params

     if(!videoId){
        throw new ApiError(400,"videoId is missing")
    }

    if(!mongoose.isValidObjectId(videoId)){
        throw new ApiError(400,"Invalid videoID")
    }


    const video = await Video.findOneAndUpdate(
        {
            _id:videoId,
            owner:req.user?._id
        },
        [
            {
                $set:{
                    isPublished:{$not:"$isPublished"}
                }
            }
        ],
        {   new:true,
            updatePipeline:true
        }
    )

    if(!video){
        throw new ApiError(404,"video not found")
    }

    return res
    .status(200)
    .json(new ApiResponse(200,video,"toggled publish status successfully"))

})


export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}