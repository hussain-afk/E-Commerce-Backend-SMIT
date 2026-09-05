import express from "express"
import {registerUser, loginUser, getUserProfile, getAllUsers, deleteUser, logoutUser, adminLoginUser, updateUserProfile, addUser} from '../controllers/auth.controller.js'
import { authMiddleware } from "../middlewares/auth.middleware.js"

const router = express.Router()
// routes
router.post("/register", registerUser)
router.post("/login", loginUser)
router.get("/profile", authMiddleware, getUserProfile)
router.get("/logout", authMiddleware, logoutUser)
// admin pannel routes
router.post("/admin-login",authMiddleware, adminLoginUser)
router.delete("/del-profile/:id", authMiddleware, deleteUser)
router.get("/all-users", authMiddleware, getAllUsers)
router.patch("/update-profile/:id", authMiddleware, updateUserProfile)
router.post("/admin-add", authMiddleware, addUser)

export default router