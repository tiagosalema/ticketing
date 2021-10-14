import mongoose from 'mongoose';

import { natsWrapper } from '../../../nats-wrapper';
import { OrderCreatedListener } from '../order-created-listener';

import { Message } from 'node-nats-streaming';
import { OrderStatus, OrderCreatedEvent } from '@udemy-ts-tickets/common';
import { Order } from '../../../models/order';

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);

  const data: OrderCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    expiresAt: 'sdfsdf',
    status: OrderStatus.Created,
    userId: 'sldkfj',
    version: 0,
    ticket: {
      id: 'sdfkj',
      price: 10,
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it('replicates the order info', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const order = await Order.findById(data.id);
  expect(order!.price).toEqual(data.ticket.price);
});
