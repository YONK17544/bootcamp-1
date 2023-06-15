import express from "express";
import { getUser, logOut, loginUser, registerUser, updateDetails } from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", registerUser)

router.post("/login", loginUser)

router.post("/logout",authMiddleware, logOut)

router.post("/me",authMiddleware, getUser)

router.post("/updatedetails",authMiddleware, updateDetails)

router.get("/forgotPassword",(req,res) =>{
    
})
router.get("/resetPassword/:resettoken",(req,res) =>{
    
})
export default router;