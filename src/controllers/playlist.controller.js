import mongoose,{isValidObjectId} from "mongoose";
import {Video} from "../models/video.models.js"
import {Playlist, Playlist} from "../models/playlist.models.js"
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body

    //TODO: create playlist
    const data={};

    if(!name){
        throw new ApiError(400,"name is required!!")
    }

    data.name= name

    if(description){
       data.description=description;
    }

    data.owner= req.user?._id

    const playlist= await Playlist.create(data)

    return res
    .status(201)
    .json(new ApiResponse(201,playlist,"playlist created successfully"))
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    //TODO: get user playlists

    if(!userId){
        throw new ApiError(400,"userID not available")
    }

    if(!isValidObjectId(userId)){
        throw new ApiError(400,"Invalid userID")
    }

    const playlist= await Playlist.find(
        {
            owner:userId
        }
    )

    if(playlist.length===0){
        throw new ApiError(404,"playlist not found")
    }

    return res
    .status(200)
    .json(new ApiResponse(200,playlist,"Playlists fetched successfully"))
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id

    if(!playlistId){
        throw new ApiError(400,"playlist Id is missing")
    }

    if(!isValidObjectId(playlistId)){
        throw new ApiError(400,"Invalid playlist ID")
    }

    const playlist= await Playlist.findById(playlistId).populate("videos","title description thumbnail videoFile duration owner")

    if(!playlist){
        throw new ApiError(404,"playlist not found")
    }

    return res
    .status(200)
    .json(new ApiResponse(200,playlist,"Playlist Fetched Successfully"))
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params

    if(!playlistId || !videoId){
        throw new ApiError(400,"playlistId or videoId is missing")
    }

    if(!isValidObjectId(playlistId) || !isValidObjectId(videoId)){
        throw new ApiError(400,"Invalid playlist ID or video ID")
    }

    const video = await Video.findById(videoId)

    if(!video){
      throw new ApiError(404,"Video not found")
    }

    const playlist= await Playlist.findOneAndUpdate(
        {
            owner:req.user?._id,
            _id:playlistId
        },
        {
            $addToSet:{
                videos:videoId
            }
        },
        {
            new : true
        }
    )

    if(!playlist){
        throw new ApiError(404,"Playlist not found or you are not the owner")
    }

    return res
    .status(200)
    .json(new ApiResponse(200,playlist,"video added to playlist successfully"))
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist

    if(!playlistId || !videoId){
        throw new ApiError(400,"playlistId or videoId ia missing")
    }

    if(!isValidObjectId(playlistId) || !isValidObjectId(videoId)){
        throw new ApiError(400,"Invalid playlistID or videoId")
    }

    const playlist= await Playlist.findOneAndUpdate(
        {
            _id:playlistId,
            owner:req.user?._id
        },
        {
            $pull:{
                videos:videoId
            }
        },
        {
            new : true
        }
    )

    if(!playlist){
        throw new ApiError(404,"playlist not found")
    }

    return res
    .status(200)
    .json(new ApiResponse(200,playlist,"video removed from playlist"))

})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist

    if(!playlistId){
        throw new ApiError(400,"playlistId is missing")
    }

    if(!isValidObjectId(playlistId)){
        throw new ApiError(400,"Invalid playlist Id")
    }

    const playlist = await Playlist.findOneAndDelete(
        {
            _id:playlistId,
            owner:req.user?._id
        }
    )

    if(!playlist){
        throw new ApiError(404,"Playlist not found")
    }

    return res
    .status(200)
    .json(new ApiResponse(200,playlist,"playlist deleted successfully"))
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist

    if(!playlistId){
        throw new ApiError(400,"playlist Id is missing")
    }

    if(!isValidObjectId(playlistId)){
        throw new ApiError(400,"Invalid playlist Id")
    }

    const data={}

    if(name){
        data.name=name
    }

    if(description!== undefined){
        data.description=description
    }

    if (Object.keys(data).length === 0) {
    throw new ApiError(400, "Nothing to update");
}

    const playlist = await Playlist.findOneAndUpdate(
        {
            _id:playlistId,
            owner:req.user?._id
        },
        {
            $set:data
        },
        {
            new:true
        }
    )

    if(!playlist){
        throw new ApiError(404,"playlist not found")
    }

    return res
    .status(200)
    .json(new ApiResponse(200,playlist,"playlist updated successfully"))
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}