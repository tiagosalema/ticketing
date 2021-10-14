import { Message } from 'node-nats-streaming';
import {
  Listener,
  Subjects,
  OrderCancelledEvent,
  NotFoundError,
  OrderStatus,
} from '@udemy-ts-tickets/common';

import { queueGroupName } from './queue-group-name';
import { Order } from '../../models/order';

class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    const order = await Order.findOne({
      id: data.id,
      version: data.version - 1,
    });

    if (!order) {
      throw new NotFoundError();
    }

    order.set({ status: OrderStatus.Cancelled });
    await order.save();
  }
}
export { OrderCancelledListener };
