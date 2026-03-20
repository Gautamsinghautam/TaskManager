import express from 'express';
import userRoutes from "./userRoutes.js";
import taskRoutes from "./taskRoute.js";

const router = express.Router();

router.use("/user", userRoutes);
router.use("/task", taskRoutes);

export default router;