import { OrderCreatedListener } from './events/listeners/order-created-listener';
import { nats } from '@udemy-ts-tickets/common';

const start = async () => {
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
  } catch (err) {
    console.error(err);
  }
};

start();
