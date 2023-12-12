import express from "express";
import catchAsync from "../utils/catchAsync.js";
import { fetchBrandsController, createBrandController } from "../controllers/brand.controller.js";

const router = express.Router();

router.get('/', catchAsync(fetchBrandsController)).post('/', catchAsync(createBrandController));

export default router;
