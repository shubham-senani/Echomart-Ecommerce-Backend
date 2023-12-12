import express from 'express';
import {checkAuth} from '../middlewares/auth.middleware.js';
import catchAsync from '../utils/catchAsync.js';
import { fetchAllProducts, createProduct, fetchProductById, updateProduct } from '../controllers/product.controller.js';
const router = express.Router();

router.post('/', checkAuth, catchAsync(createProduct))
      .get('/', checkAuth, catchAsync(fetchAllProducts))
      .get('/:id', checkAuth, catchAsync(fetchProductById))
      .patch('/:id', checkAuth, catchAsync(updateProduct))

export default router;
