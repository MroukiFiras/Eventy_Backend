import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import connectDatabase from "./config/dbConnection.js";
import connectCloudinary from "./config/cloudinaryConnection.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const port = process.env.PORT;

const app = express();

// Middleware
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Connection to dataBase and cloudinary
connectDatabase();
connectCloudinary();

// Routes
app.use("/api/auth", authRoutes);

// 404 error handler
app.use((req, res) => {
  res.status(404).json({ message: "404: Page Not Found", state: false });
});

// Server listening
app.listen(port, () => {
  console.log(`Server Listening on port ${port}`);
});
