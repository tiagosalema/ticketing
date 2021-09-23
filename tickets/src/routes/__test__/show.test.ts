import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';

function createTicket(ticket = { title: 'Ticket title', price: 10 }) {
  return request(app).post('/api/tickets').set('Cookie', global.signin()).send(ticket);
}

it('can fetch a list of tickets', async () => {
  await createTicket();
  await createTicket();
  await createTicket();

  const res = await request(app).get('/api/tickets').expect(200);

  expect(res.body.length).toEqual(3);
});

it("returns a 404 if the ticket isn't found", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  const x = new mongoose.Types.ObjectId();
  await request(app).get(`/api/tickets/${id}`).send().expect(404);
});

it('returns the ticket if the ticket is found', async () => {
  const ticket = { title: 'Ticket title', price: 10 };
  const res = await createTicket(ticket);

  const ticketRes = await request(app)
    .get(`/api/tickets/${res.body.id}`)
    .send()
    .expect(200);

  expect(ticketRes.body.title).toEqual(ticket.title);
  expect(ticketRes.body.price).toEqual(ticket.price);
});
