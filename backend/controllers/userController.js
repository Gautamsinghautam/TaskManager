import Notice from "../models/notification.js";
import User from "../models/user.js";
import { createJWT } from "../utils/index.js";

export const registerUser = async (req, res) => {
    try {
        const { name, email, password, isAdmin, role, title } = req.body;

        console.log("Register request body:", req.body);

        // Validate required fields
        if (!name || !email || !password || !role || !title) {
            return res.status(400).json({
                status: false,
                message: "Please provide all required fields: name, email, password, role, title",
            });
        }

        const userExist = await User.findOne({ email });

        if(userExist){
            return res.status(400).json({
                status: false,
                message: "User already exist",
            });
        }

        const user = await User.create({
            name, 
            email, 
            password, 
            isAdmin: isAdmin || false, 
            role, 
            title,
        });

        if(user){
            console.log("User created successfully:", user._id);
            if(isAdmin) {
                createJWT(res, user._id);
            }

            user.password  = undefined;

            res.status(201).json({
                status: true,
                message: "User registered successfully",
                user: user
            });
        }else {
            return res
                .status(400)
                .json({ status: false, message: "Invalid user data "});
        }

    } catch (error) {
        console.error("Register error:", error);
        console.error("Error details:", error.message, error.stack);
        
        // Handle mongoose validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors)
                .map(err => err.message)
                .join(', ');
            return res.status(400).json({ 
                status: false, 
                message: `Validation error: ${messages}` 
            });
        }
        
        // Handle duplicate key error
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            return res.status(400).json({ 
                status: false, 
                message: `${field} already exists` 
            });
        }
        
        return res.status(400).json({ 
            status: false, 
            message: error.message || 'Failed to register user' 
        });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password} = req.body;

        const user = await User.findOne({email});

        if(!user){
            return res
                .status(401)
                .json({ status: false, message: "Invalid email or password. "});
        }

        if(!user?.isActive){
            return res.status(401).json({
                status: false,
                message: "User account deactivated , contact administrator",
            });
        }
        const isMatch= await user.matchPassword(password)

        if(user && isMatch){
            createJWT(res, user._id)
            user.password = undefined
            res.status(200).json(user); 
        } else {
            return res.status(401).json({ 
                status: false, 
                message: "Invalid email or password." 
            });
        }
    } catch (error) {
        return res.status(400).json({ status: false, message: error.message });
    }
};

export const logoutUser = async (req, res) => {
    try {
        res.cookie("token", "", {
            httpOnly: true,
            expires: new Date(0),

        });
        res.status(200).json({message: "Logout successful"});

    } catch (error) {
        return res.status(400).json({ status: false, message: error.message });
    }
};

export const getTeamList = async (req, res) => {
    try {
        const users = await User.find({ isActive: true }).select("_id name title role email isActive");

        res.status(200).json(users)

    } catch (error) {
        return res.status(400).json({ status: false, message: error.message });
    }
};

export const getNotificationList = async (req, res) => {
    try {
        const {userId} = req.user;
        const notifications = await Notice.find({
            team: userId,
            isRead: { $nin: [userId] },
        })
            .populate("task", "title")
            .sort({ createdAt: -1 })
            .limit(10);
        res.status(200).json(notifications);

    } catch (error) {
        return res.status(400).json({ status: false, message: error.message });
    }
};

export const updateUserProfile = async (req, res) => {
    try {
        const {userId, isAdmin} = req.user;
        const { _id } = req.body;

        // Determine which user to update
        const id = isAdmin && userId === _id ? userId : isAdmin && userId !== _id ? _id : userId;

        const user = await User.findById(id);

        if(user) {
            // Update profile fields
            if (req.body.name) user.name = req.body.name;
            if (req.body.title) user.title = req.body.title;
            if (req.body.role) user.role = req.body.role;

            const updateUser = await user.save();
            updateUser.password = undefined;

            res.status(200).json({
                status: true,
                message: "Profile Updated Successfully",
                user: updateUser,
            });
        } else {
            res.status(404).json({ status: false, message: "User not found" });
        }

    } catch (error) {
        return res.status(400).json({ status: false, message: error.message });
    }
};

export const markNotificationRead = async (req, res) => {
    try {
        const { userId } = req.user;
        const { isReadType, id } = req.query;

        if(isReadType === "all") {
            await Notice.updateMany(
                {team: userId, isRead: {$nin: [userId]}},
                { $push: {isRead: userId } },
                { new: true }
            );

        } else {
            await Notice.findOneAndUpdate (
                {_id: id, isRead: { $nin: [userId]}},
                { $push: {isRead: userId }},
                { new: true}
            );
        }
        res.status(201).json({ status: true, message: "Done" });

    } catch (error) {
        return res.status(400).json({ status: false, message: error.message });
    }
};

export const changeUserPassword = async (req, res) => {
    try {
        const { userId } = req.user;
        const { oldPassword, password } = req.body;

        // Validate inputs
        if (!oldPassword || !password) {
            return res.status(400).json({
                status: false,
                message: "Old password and new password are required"
            });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ 
                status: false, 
                message: "User not found" 
            });
        }

        // Verify old password
        const isPasswordMatch = await user.matchPassword(oldPassword);
        if (!isPasswordMatch) {
            return res.status(401).json({
                status: false,
                message: "Old password is incorrect"
            });
        }

        // Update with new password (will be hashed by pre-save hook)
        user.password = password;
        await user.save();

        user.password = undefined;
        res.status(201).json({ 
            status: true, 
            message: "Password changed successfully",
            user: user
        });
    } catch (error) {
        return res.status(400).json({ 
            status: false, 
            message: error.message 
        });
    }
};


export const activeUserProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if(user) {
            // Update basic user fields if provided
            if (req.body.name) user.name = req.body.name;
            if (req.body.title) user.title = req.body.title;
            if (req.body.role) user.role = req.body.role;
            if (req.body.email) user.email = req.body.email;
            
            // Update isActive if provided
            if (req.body.isActive !== undefined) {
                user.isActive = req.body.isActive;
            }
            
            await user.save();

            res.status(201).json ({
                status: true,
                message: `user account updated successfully`,
                user: user,
            });
        } else {
            res.status(404).json({ status: false, message: "User not found" });
        }
    } catch (error) {
        return res.status(400).json({ status: false, message: error.message });
    }
};


export const deleteUserProfile = async (req, res) => {
    try {
        const { id } = req.params;
        await User.findByIdAndUpdate(id, { isActive: false }, { new: true });
        res
            .status(200)
            .json({ status: true, message: "User deleted successfully" });
    } catch (error) {
        return res.status(400).json({ status: false, message: error.message });
    }
};



