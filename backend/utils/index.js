import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("db is connected");
    } catch (error) {
        console.log("DB error " + error);
    }
};

export default dbConnection;

export const createJWT = (res, userId) => {
    const token = jwt.sign({userId }, process.env.JWT_SECRET, {
        expiresIn : process.env.JWT_EXPIRE,
        
    });
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict", //prevent CSRF attacks
        maxAge: 1* 24 * 60 * 60 * 1000, // 1 day

    });
}