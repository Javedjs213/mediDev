import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();
// import 'dotenv/config';  


const connectDB = async () => {

    mongoose.connection.on("connected", () => {
        console.log("Database Connected...");
    });

    mongoose.connection.on("error", (error) => {
        console.error("Database connection error: ", error.message);
    });


    try {
        console.log(process.env.MONGODB_URI);
        await mongoose.connect(process.env.MONGODB_URI);
        // await mongoose.connect(`mongodb://localhost:27017/medic`);
    } catch (error) {
        console.error("Database connection failed: ", error.message);
        process.exit(1);
    }
};

export default connectDB;












