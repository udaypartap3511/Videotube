import { upload } from "../middlewares/multer.middleware.js";
import { publishAVideo } from "../controllers/video.controller.js";
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


export default router