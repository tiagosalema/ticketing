import { Message } from 'node-nats-streaming';
import {
  Listener,
  Subjects,
  NotFoundError,
  PaymentCreatedEvent,
  OrderStatus,
} from '@udemy-ts-tickets/common';

import { queueGroupName } from './queue-group-name';
import { Order } from '../../models/order';

class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
    const order = await Order.findById(data.orderId);
    if (!order) {
      throw new NotFoundError();
    }
    order.set({ status: OrderStatus.Complete });
    await order.save();
    // since order has been updated, it would be appropriate to
    // emit an event anouncing it. On the scope of this app, no updates
    // will be made to orders henceforth, so that will not be necessary
  }
}
export { PaymentCreatedListener };
