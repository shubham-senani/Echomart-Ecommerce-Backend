import express from 'express';
import {checkAuth} from '../middlewares/auth.middleware.js';
import catchAsync from '../utils/catchAsync.js';
import { fetchAllProducts, createProduct, fetchProductById, updateProduct } from '../controllers/product.controller.js';
const router = express.Router();

router.post('/', catchAsync(createProduct))
      .get('/',  catchAsync(fetchAllProducts))
      .get('/:id', catchAsync(fetchProductById))
      .patch('/:id', catchAsync(updateProduct))

export default router;
