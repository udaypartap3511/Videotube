import { upload } from "../middlewares/multer.middleware.js";
import { deleteVideo, getAllVideos, getVideoById, publishAVideo, togglePublishStatus, updateVideo } from "../controllers/video.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { Router } from "express";



const router= Router();

router.route("/publishVideo").post(
    verifyJWT,
    upload.fields(
        [
        {
            name:"videoFile",
            maxCount:1
        },
        {
            name:"thumbnail",
            maxCount:1
        }
    ]
    ),
    publishAVideo
)

router.route("/").get(getAllVideos)

router.route("/toggle/publish/:videoId").patch(verifyJWT,togglePublishStatus)

router.route("/:videoId").get(getVideoById)

router.route("/:videoId").patch(verifyJWT,upload.single("thumbnail"),updateVideo)

router.route("/:videoId").delete(verifyJWT,deleteVideo)


export default router