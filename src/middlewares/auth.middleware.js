import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
import catchAsync from "../utils/catchAsync.js";
import userModel from "../models/user.model.js";

// Function to extract the value of a cookie by name
function getCookieValue(cookieString, cookieName) {
    const cookies = cookieString.split('; ');
    for (const cookie of cookies) {
        const [name, value] = cookie.split('=');
        if (name === cookieName) {
            return value;
        }
    }
    return null;
}

//================ Authorisation =========================
export const checkAuth = catchAsync(async (req, res, next) => {
    // Extract the token from the headers
    const token = getCookieValue(req.headers.cookie, 'token');

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
