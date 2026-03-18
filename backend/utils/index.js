import mongoose from "mongoose";

const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("db is connected");
    } catch (error) {
        console.log("DB error " + error);
    }
};

export default dbConnection;