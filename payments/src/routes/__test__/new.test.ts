import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { Order } from '../../models/order';
import { OrderStatus } from '@udemy-ts-tickets/common';
import { stripe } from '../../stripe';
import { Payment } from '../../models/payment';

jest.mock('../../stripe');

it('returns a 404 when purchasing a non-existing order', async () => {
  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({
      token: 'aksdfja',
      orderId: new mongoose.Types.ObjectId().toHexString(),
    })
    .expect(404);
});

it('returns a 401 when purchasing an order that doesnt belong to the user', async () => {
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    userId: 'userId',
    status: OrderStatus.Created,
    price: 10,
  });
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({
      token: 'aksdfja',
      orderId: order.id,
    })
    .expect(401);
});

it('returns a 400 when purchasing a cancelled order', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    userId,
    status: OrderStatus.Cancelled,
    price: 10,
  });
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin(userId))
    .send({
      orderId: order.id,
      token: 'alsdkfjas',
    })
    .expect(400);
});

it('returns a 201 with valid inputs', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    userId,
    status: OrderStatus.Created,
    price: 10,
  });
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin(userId))
    .send({
      token: 'tok_visa',
      orderId: order.id,
    })
    .expect(201);

  const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];

  expect(chargeOptions.source).toEqual('tok_visa');
  expect(chargeOptions.amount).toEqual(order.price * 100);
  expect(chargeOptions.currency).toEqual('gbp');

  const payment = await Payment.findOne({
    orderId: order.id,
    stripeId: 'abcd', // 'abcd' is the value assigned in the mock
  });

  expect(payment).toBeDefined();
  expect(payment!.orderId).toEqual(order.id);
});
