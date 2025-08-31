import mongoose from "mongoose";

export const connectDB = async () => {
  try {
   
    const mongoURI = process.env.MONGO_URI || "mongodb+srv://mtechgaurav03:iB4QB0XeDhM9FlaM@cluster0.0xtlgy3.mongodb.net/notesapp";
    
    console.log('Attempting to connect to MongoDB...');
    
    await mongoose.connect(mongoURI);
    
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("DB connection error:", err);
    console.error("MongoDB URI being used:", process.env.MONGO_URI ? "From environment variable" : "Using fallback URI");
    process.exit(1); 
  }
};