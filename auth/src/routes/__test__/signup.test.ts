import request from 'supertest';
import { app } from '../../app';

it('returns a 201 on successful signup', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@gmail.com',
      password: 'password123',
    })
    .expect(201);
});

it('returns 400 with an invalid email', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'abc',
      password: 'password123',
    })
    .expect(400);
});

it('returns 400 with an invalid password', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@gmail.com',
      password: '1',
    })
    .expect(400);
});

it('returns 400 with an invalid missing email and password', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({ email: 'test@gmail.com' })
    .expect(400);
  await request(app)
    .post('/api/users/signup')
    .send({ password: 'password123' })
    .expect(400);
  await request(app).post('/api/users/signup').send({}).expect(400);
});

it('disallows duplicate emails', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@gmail.com',
      password: 'password123',
    })
    .expect(201);

  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@gmail.com',
      password: 'password123',
    })
    .expect(400);
});

it('sets a cookie after successful signup', async () => {
  const res = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@gmail.com',
      password: 'password123',
    })
    .expect(201);

  expect(res.get('Set-Cookie')).toBeDefined();
});
