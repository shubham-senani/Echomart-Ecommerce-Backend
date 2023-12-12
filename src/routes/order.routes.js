import express from 'express';
import catchAsync from '../utils/catchAsync.js';
import { checkAuth } from '../middlewares/auth.middleware.js';
import { createOrder, fetchOrdersByUser, deleteOrder, updateOrder, fetchAllOrders } from '../controllers/order.controller.js';

const router = express.Router();

router.post('/', checkAuth, catchAsync(createOrder))
      .get('/own/', checkAuth, catchAsync(fetchOrdersByUser))
      .delete('/:id', checkAuth, catchAsync(deleteOrder))
      .patch('/:id', checkAuth, catchAsync(updateOrder))
      .get('/', checkAuth, catchAsync(fetchAllOrders))


export default router;
