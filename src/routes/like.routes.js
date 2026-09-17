import { Router } from "express";
import { getLikedVideos, toggleCommentLike, toggleTweetLike, toggleVideoLike } from "../controllers/like.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router= Router();

router.route("/video/:videoId").patch(verifyJWT,toggleVideoLike)
router.route("/comment/:commentId").patch(verifyJWT,toggleCommentLike)
router.route("/tweet/:tweetId").patch(verifyJWT,toggleTweetLike)
router.route("/liked-videos").get(verifyJWT,getLikedVideos)



export default router