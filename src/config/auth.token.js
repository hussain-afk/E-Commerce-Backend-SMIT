import jwt from "jsonwebtoken"
import config from "./config.js"

export const generateToken = (userId, role) => {
    try {
        const token = jwt.sign({ id: userId, role: role }, config.jwtSecret, { expiresIn: config.tokenExpiration })
        return token
    } catch (error) {
        console.error("Error generating token:", error)
        throw new Error("Error generating token")
    }
}