import express from "express";
import UserService from "../services/user";
const router = express.Router();

router.route("/getUser").get();

export default router;
