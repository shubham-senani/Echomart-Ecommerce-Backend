import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
import catchAsync from "../utils/catchAsync.js";
import userModel from "../models/user.model.js";

//================ Authorisation =========================
export const checkAuth = catchAsync(async (req, res, next) => {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer')) {
        return next(new ApiError("Authorization failed", 401))
    }
    const token = authHeader.split(' ')[1]
    if (!token) {
        return next(new ApiError("Authorization failed", 401))
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = payload;

    // Iscluster exist
    const freshUser = await userModel.findOne({ _id: payload.id });
    if (!freshUser) {
        return next(new ApiError("The user belonging to this token no longer exist", 401))
    }
    next();
});
