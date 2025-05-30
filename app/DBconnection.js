import mongoose from "mongoose";

const connectDB = async () => {
    // Check if Mongoose is already connected or is currently connecting
    if (mongoose.connection.readyState >= 1) {
        console.log("MongoDB is already connected.");
        return;
    }

    const connectionString =
        "mongodb+srv://rashasalah:UVnEn4BegulQ2Gbf@trainlink.kqphfbl.mongodb.net/trainlink?retryWrites=true&w=majority&appName=trainlink";

    try {
        await mongoose.connect(connectionString);
        console.log("MongoDB Connected Successfully!");
    } catch (err) {
        console.error("MongoDB connection error:", err.message);
        process.exit(1); // Exit process with failure
    }
};

export default connectDB;
