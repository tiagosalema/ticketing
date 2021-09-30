import express, { Request, Response } from 'express';
import {
  requireAuth,
  validateRequest,
  NotFoundError,
  BadRequestError,
} from '@udemy-ts-tickets/common';
import { body } from 'express-validator';
import mongoose from 'mongoose';
import { Ticket } from '../models/ticket';
import { Order, OrderStatus } from '../models/order';

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 15 * 60;

router.post(
  '/api/orders',
  requireAuth,
  [
    body('ticketId')
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('TicketId must be provided'),
  ],
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw new NotFoundError();
    }

    const existingOrder = await ticket.isReserved();
    if (existingOrder) {
      throw new BadRequestError('Ticket is already reserved');
    }

    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket,
    });

    await order.save();

    res.status(201).send(order);
  },
);

export { router as newOrderRouter };
