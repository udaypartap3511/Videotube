import {Router} from "express";
import { addVideoToPlaylist, createPlaylist, deletePlaylist, getPlaylistById, getUserPlaylists, removeVideoFromPlaylist, updatePlaylist } from "../controllers/playlist.controller.js";
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router= Router();

router.route("/").post(verifyJWT,createPlaylist)
router.route("/user/:userId").get(getUserPlaylists)
router.route("/:playlistId").get(getPlaylistById)
router.route("/:playlistId/video/:videoId").patch(verifyJWT,addVideoToPlaylist)
router.route("/:playlistId/video/:videoId").delete(verifyJWT,removeVideoFromPlaylist)
router.route("/:playlistId").delete(verifyJWT,deletePlaylist)
router.route("/:playlistId").patch(verifyJWT,updatePlaylist)



export default router;