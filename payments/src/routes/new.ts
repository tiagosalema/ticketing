import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { natsWrapper } from '../nats-wrapper';
import {
  requireAuth,
  BadRequestError,
  NotFoundError,
  validateRequest,
  NotAuthorizedError,
  OrderStatus,
} from '@udemy-ts-tickets/common';
import { Order } from '../models/order';

import mongoose from 'mongoose';
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher';

const router = express.Router();

router.post(
  '/api/payments',
  requireAuth,
  [body('orderId').not().isEmpty(), body('token').not().isEmpty()],
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId != req.currentUser!.id) {
      throw new NotAuthorizedError();
    }
    if (order.status == OrderStatus.Cancelled) {
      throw new BadRequestError('Cannot pay for a cancelled order');
    }

    res.send({ success: 'yiiis' });
  },
);

export { router as createChargeRouter };
