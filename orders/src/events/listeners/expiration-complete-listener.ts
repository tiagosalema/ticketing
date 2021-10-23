import { Message } from 'node-nats-streaming';
import {
  Listener,
  Subjects,
  ExpirationCompleteEvent,
  NotFoundError,
  OrderStatus,
} from '@udemy-ts-tickets/common';

import { Order } from '../../models/order';
import { queueGroupName } from './queue-group-name';
import { OrderCancelledPublisher } from '../publishers/order-cancelled-publisher';

class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
  queueGroupName = queueGroupName;

  async onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {
    const order = await Order.findById(data.orderId);

    if (!order) {
      throw new NotFoundError();
    }
    if (order.status == OrderStatus.Complete) return;

    order.set({
      status: OrderStatus.Cancelled,
    });
    await order.save();

    new OrderCancelledPublisher(this.client).publish({
      id: order.id,
      ticket: {
        id: order.ticket.toString(),
      },
      version: order.version,
    });
  }
}
export { ExpirationCompleteListener };
