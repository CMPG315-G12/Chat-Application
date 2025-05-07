import express from "express";
import { protectRoute } from "../middleware/auth.middleware.protectRoute.js";
import { getUsersForContactList, getMessagesU, getMessagesG, sendMessageU, sendMessageG, newGroup, joinGroup, leaveGroup, addFirend, removeFriend } from "../controllers/message.controller.js";
const router = express.Router();

/* --- Get Users for Contact List --- */
router.get("/contacts", protectRoute, getUsersForContactList);

/* --- Get and Send Messages --- */
router.get("/u/:id", protectRoute, getMessagesU);
router.get("/g/:id", protectRoute, getMessagesG);
router.post("/send/u/:id", protectRoute, sendMessageU);
router.post("/send/g/:id", protectRoute, sendMessageG);

/* --- Group Management --- */
router.post("/create/group", protectRoute, newGroup);
router.post("/g/join/:id", protectRoute, joinGroup);
router.post("/g/leave/:id", protectRoute, leaveGroup);

/* --- User Friend List Management --- */
router.post("/u/add/:id", protectRoute, addFirend);
router.post("/u/remove/:id", protectRoute, removeFriend);


export default router;