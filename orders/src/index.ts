import mongoose from 'mongoose';

import { nats } from '@udemy-ts-tickets/common';

import { app } from './app';
import { TicketCreatedListener } from './events/listeners/ticket-created-listener';
import { TicketUpdatedListener } from './events/listeners/ticket-updated-listener';
import { ExpirationCompleteListener } from './events/listeners/expiration-complete-listener';
import { PaymentCreatedListener } from './events/listeners/payment-created-listener';

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

    new TicketCreatedListener(nats.client).listen();
    new TicketUpdatedListener(nats.client).listen();
    new ExpirationCompleteListener(nats.client).listen();
    new PaymentCreatedListener(nats.client).listen();

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
