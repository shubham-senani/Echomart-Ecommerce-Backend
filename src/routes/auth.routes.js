import express from "express";
import catchAsync from "../utils/catchAsync.js";
import { checkAuth } from "../middlewares/auth.middleware.js";
import { createUserController, loginUserController, checkAuthController, logoutController, resetPasswordRequestController, resetPasswordController } from "../controllers/auth.controller.js";

const router = express.Router();

router.post('/signup', catchAsync(createUserController));

router.post('/login', catchAsync(loginUserController));

router.get('/check', checkAuth, catchAsync(checkAuthController));

router.get('/logout', checkAuth, catchAsync(logoutController));

router.post('/reset-password-request', catchAsync(resetPasswordRequestController));

router.post('/reset-password', catchAsync(resetPasswordController));

export default router;
