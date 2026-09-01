import dotenv from "dotenv"
dotenv.config()

const config = {
    port: process.env.PORT || 4000,
    mongoUri: process.env.MONGO_URI,
    jwtSecret: process.env.JWT_SECRET,
    frontendUrl: process.env.FRONTEND_URL,
    tokenExpiration: process.env.TOKEN_EXPIRATION
}

export default config