import mongoose from "mongoose";

const connectDB = async () => {
    // Check if Mongoose is already connected or is currently connecting
    if (mongoose.connection.readyState >= 1) {
        console.log("MongoDB is already connected.");
        return;
    }

    const connectionString =
        "mongodb://rashasalah:hKn6KpnYdOc1PBsm@ac-6xaauvs-shard-00-00.rswj1dj.mongodb.net:27017,ac-6xaauvs-shard-00-01.rswj1dj.mongodb.net:27017,ac-6xaauvs-shard-00-02.rswj1dj.mongodb.net:27017/?ssl=true&replicaSet=atlas-12jao1-shard-0&authSource=admin&appName=Main";
    // "mongodb://rashasalah:hKn6KpnYdOc1PBsm@main.rswj1dj.mongodb.net/trainlink?appName=Main";
    // "mongodb+srv://rashasalah:UVnEn4BegulQ2Gbf@trainlink.kqphfbl.mongodb.net/trainlink?retryWrites=true&w=majority&appName=trainlink";

    try {
        await mongoose.connect(connectionString);
        console.log("MongoDB Connected Successfully!");
    } catch (err) {
        console.error("MongoDB connection error:", err.message);
        process.exit(1); // Exit process with failure
    }
};

export default connectDB;
