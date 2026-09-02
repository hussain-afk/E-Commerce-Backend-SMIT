import express from "express"
import config from "./src/config/config.js"
import connectDB from "./src/config/database.js"
import cookieParser from "cookie-parser"
import authRoutes from "./src/router/auth.route.js"
import productRoutes from "./src/router/products.route.js"
import cors from "cors"

// console.log(config.frontendUrl)
// middleware
const app = express();
const allowedOrigins = [
  config.frontendUrl,
  config.adminFrontendUrl,
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.options("*", cors()); // Enable pre-flight for all routes
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
// routes
app.use("/api/auth", authRoutes)
app.use("/api/data/", productRoutes)
// connect to database
connectDB()
// start the server
app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`)
})