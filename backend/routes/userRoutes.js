import express from "express";
import { isAdminRoute, protectRoute } from "../middlewares/authMiddleware.js";
import { activeUserProfile, changeUserPassword, deleteUserProfile, getNotificationList, getTeamList, loginUser, logoutUser, markNotificationRead, registerUser, updateUserProfile } from "../controllers/userController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

// Allow all authenticated users to see team list, but return based on admin level
router.get("/get-team", protectRoute, getTeamList);
router.get("/notification", protectRoute, getNotificationList);

router.put("/profile", protectRoute, updateUserProfile);
router.put("/read-noti", protectRoute, markNotificationRead);
router.put("/change-password", protectRoute, changeUserPassword);

// // FOr Admin Only - Admin Routes
router
    .route("/:id")
    .put(protectRoute, isAdminRoute, activeUserProfile)
    .delete(protectRoute, isAdminRoute, deleteUserProfile);

export default router;