import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';

it('returns a 404 if the provided id does not exist', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'title',
      price: 20,
    })
    .expect(404);
});

it('returns a 401 if the user is not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: 'title',
      price: 20,
    })
    .expect(401);
});

it('returns a 401 if the user does not own the ticket', async () => {
  const res = await request(app)
    .post(`/api/tickets`)
    .set('Cookie', global.signin())
    .send({
      title: 'title',
      price: 20,
    });

  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set('Cookie', global.signin())
    .send({ title: 'lkdsjf', price: 10 })
    .expect(401);
});

it('returns a 400 if the user provides an invalid title or price', async () => {
  const cookie = global.signin();

  const res = await request(app)
    .post(`/api/tickets`)
    .set('Cookie', cookie)
    .send({
      title: 'adskfjs',
      price: 20,
    });

  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set('Cookie', cookie)
    .send({ title: '', price: 10 })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set('Cookie', cookie)
    .send({ title: 'dsfaasdf', price: -10 })
    .expect(400);
});

it('updates the ticket provided valid inputs', async () => {
  const cookie = global.signin();

  const title1 = 'Original Title';
  const title2 = 'Updated Title';
  const price1 = 10;
  const price2 = 20;

  const originalTicket = await request(app)
    .post(`/api/tickets`)
    .set('Cookie', cookie)
    .send({
      title: title1,
      price: price1,
    });

  await request(app)
    .put(`/api/tickets/${originalTicket.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: title2,
      price: price2,
    })
    .expect(200);

  const updatedTicket = await request(app)
    .get(`/api/tickets/${originalTicket.body.id}`)
    .send();

  expect(originalTicket.body.title).toEqual(title1);
  expect(originalTicket.body.price).toEqual(price1);

  expect(updatedTicket.body.title).toEqual(title2);
  expect(updatedTicket.body.price).toEqual(price2);
});
