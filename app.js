import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import connectDatabase from "./config/dbConnection.js";
import connectCloudinary from "./config/cloudinaryConnection.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminCategoryRoutes from "./routes/adminCategoryRoutes.js";
import adminCenterOfInterestRoutes from "./routes/adminCenterOfInterestRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import requestParticipationRoutes from "./routes/requestParticipationRoutes.js";
import participationRoutes from "./routes/participationRoutes.js";

dotenv.config();

const port = process.env.PORT;

const app = express();

// Middleware
app.use(morgan("dev"));
app.use(
  cors({
    origin: "http://localhost:8100", // Replace with your frontend's URL if needed
    exposedHeaders: ["auth-token"], // Allow the frontend to access the 'auth-token' header
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Connection to dataBase and cloudinary
connectDatabase();
connectCloudinary();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin/categories", adminCategoryRoutes);
app.use("/api/admin/centers", adminCenterOfInterestRoutes);
app.use("/api/event", eventRoutes);
app.use("/api/event/request", requestParticipationRoutes);
app.use("/api/event/participation", participationRoutes);

// 404 error handler
app.use((req, res) => {
  res.status(404).json({ message: "404: Page Not Found", state: false });
});

// Server listening
app.listen(port, () => {
  console.log(`Server Listening on port ${port}`);
});
