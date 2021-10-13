import request from 'supertest';
import { app } from '../../app';
import { Order, OrderStatus } from '../../models/order';
import { Ticket } from '../../models/ticket';
import mongoose from 'mongoose';

const buildTicket = async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  });
  await ticket.save();

  return ticket;
};

it('fetched order for a particular user', async () => {
  const ticket_1 = await buildTicket();
  const ticket_2 = await buildTicket();
  const ticket_3 = await buildTicket();

  const user_1 = global.signin();
  const user_2 = global.signin();

  // Save the 1st ticket to user-1 and the remaining 2 to user-2

  await request(app)
    .post('/api/orders')
    .set('Cookie', user_1)
    .send({ ticketId: ticket_1.id })
    .expect(201);

  const { body: order_1 } = await request(app)
    .post('/api/orders')
    .set('Cookie', user_2)
    .send({ ticketId: ticket_2.id })
    .expect(201);

  const { body: order_2 } = await request(app)
    .post('/api/orders')
    .set('Cookie', user_2)
    .send({ ticketId: ticket_3.id })
    .expect(201);

  const res = await request(app)
    .get('/api/orders')
    .set('Cookie', user_2)
    .expect(200);

  expect(res.body.length).toEqual(2);
  expect(res.body[0].id).toEqual(order_1.id);
  expect(res.body[1].id).toEqual(order_2.id);
  expect(res.body[0].ticket.id).toEqual(ticket_2.id);
  expect(res.body[1].ticket.id).toEqual(ticket_3.id);
});
