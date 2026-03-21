import express from "express";
import { isAdminRoute, protectRoute } from "../middlewares/authMiddleware.js";
import { activeUserProfile, changeUserPassword, deleteUserProfile, getNotificationList, getTeamList, loginUser, logoutUser, markNotificationRead, registerUser, updateUserProfile } from "../controllers/userController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser)

router.get("/get-team", protectRoute, isAdminRoute, getTeamList);
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