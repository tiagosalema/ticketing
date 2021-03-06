import mongoose from 'mongoose';
import { app } from './app';
import { nats } from '@udemy-ts-tickets/common';
import { OrderCancelledListener } from './events/listeners/order-cancelled-listener';
import { OrderCreatedListener } from './events/listeners/order-created-listener';

const start = async () => {
  if (!process.env.JWT_KEY) throw new Error('JWT_KEY must be defined.');
  if (!process.env.MONGO_URI) throw new Error('MONGO_URI must be defined.');
  if (!process.env.NATS_CLUSTER_ID) throw new Error('NATS_CLUSTER_ID must be defined.');
  if (!process.env.NATS_CLIENT_ID) throw new Error('NATS_CLIENT_ID must be defined.');
  if (!process.env.NATS_URL) throw new Error('NATS_URL must be defined.');

  try {
    await nats.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL,
    );

    new OrderCreatedListener(nats.client).listen();
    new OrderCancelledListener(nats.client).listen();

    await mongoose.connect(process.env.MONGO_URI);
    // auth-mongo-srv is the name of the mongo-db service deployment
    // auth is the name of the db we want to create (mongoose will automatically create it)
    console.log('connected to mongodb');
  } catch (err) {
    console.error(err);
  }
  app.listen(3000, () => {
    console.log('Listening on port 3000...');
  });
};

start();
