import mongoose from "mongoose"
import config from "./config.js"

const connectDB = async () => {
    try {
        const connection = await mongoose.connect(config.mongoUri,{
            dbName: "ECOMMERCE-FULLSTACK-APP",
        })
        console.log(`MongoDB connected: ${connection.connection.host}`)
    } catch (error) {
        console.error("Error connecting to MongoDB:", error)
        process.exit(1)
    }
}

export default connectDB