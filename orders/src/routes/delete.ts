import {
  requireAuth,
  NotFoundError,
  NotAuthorizedError,
} from '@udemy-ts-tickets/common';
import express, { Request, Response } from 'express';
import { Order, OrderStatus } from '../models/order';

const router = express.Router();

router.post(
  '/api/orders/:orderId',
  requireAuth,
  async (req: Request, res: Response) => {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId != req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    order.status = OrderStatus.Cancelled;
    await order.save();

    res.send(order);
  },
);

export { router as deleteOrderRouter };
