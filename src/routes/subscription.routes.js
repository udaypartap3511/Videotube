import {Router} from "express";
import { getSubscribedChannels, getUserChannelSubscribers, toggleSubscription } from "../controllers/subscription.controller.js";
import {verifyJWT} from "../middlewares/auth.middleware.js"


const router= Router()

router.route("/toggle/:channelId").patch(
    verifyJWT,
    toggleSubscription
)

router.route("/channelSubscribers/:channelId").get(
    getUserChannelSubscribers
)

router.route("/subscribedChannels/:subscriberId").get(
    getSubscribedChannels
)



export default router;