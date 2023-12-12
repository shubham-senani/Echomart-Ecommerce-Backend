import express from 'express';
import catchAsyc from '../utils/catchAsync.js';
import { checkAuth } from '../middlewares/auth.middleware.js';
import { fetchUserById, updateUser } from '../controllers/user.controller.js';

const router = express.Router();

router.get('/own', checkAuth, catchAsyc(fetchUserById))
      .patch('/:id', checkAuth, catchAsyc(updateUser))

export default router;