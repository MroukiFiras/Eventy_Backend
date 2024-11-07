import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL_KEY);
    console.log("Database Connected Successfully");
  } catch (err) {
    console.error(`Error occurred when connecting to database: ${err}`);
    process.exit(1);
  }
};

export default connectDB;

