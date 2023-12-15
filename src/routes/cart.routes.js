import express from 'express';
import catchAsync from '../utils/catchAsync.js';
import { addToCart, fetchCartByUser, deleteFromCart, updateCart } from '../controllers/cart.controller.js';
const router = express.Router();
import { checkAuth } from '../middlewares/auth.middleware.js';

router.post('/', checkAuth, catchAsync(addToCart))
      .get('/', checkAuth,  catchAsync(fetchCartByUser))
      .delete('/:id', checkAuth, catchAsync(deleteFromCart))
      .patch('/:id', checkAuth, catchAsync(updateCart))

export default router;
