import express from 'express';
import catchAsync from '../utils/catchAsync.js';
import { fetchCategories, createCategory } from '../controllers/category.controller.js';

const router = express.Router();

router.get('/', catchAsync(fetchCategories)).post('/', catchAsync(createCategory))

export default router;
