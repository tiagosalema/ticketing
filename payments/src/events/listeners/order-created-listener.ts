import { Message } from 'node-nats-streaming';
import {
  Listener,
  Subjects,
  OrderCreatedEvent,
} from '@udemy-ts-tickets/common';

import { queueGroupName } from './queue-group-name';
import { Order } from '../../models/order';

class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const order = Order.build({
      id: data.id,
      userId: data.userId,
      status: data.status,
      price: data.ticket.price,
      version: data.version,
    });
    await order.save();
  }
}
export { OrderCreatedListener };
