import jwt from "jsonwebtoken"
import config from "../config/config.js"

export const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.token
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" })
        }
        const decoded = jwt.verify(token, config.jwtSecret)
        req.user = decoded
        next()
    } catch (error) {
        console.error("Error in auth middleware:", error)
        res.status(401).json({ message: "Invalid token" })
    }
}