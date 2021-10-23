import Queue from 'bull';
import { ExpirationCompletePublisher } from '../events/publishers/expiration-complete-publisher';
import { nats } from '@udemy-ts-tickets/common';

interface Payload {
  orderId: string;
}

const expirationQueue = new Queue<Payload>('order:expiration', {
  redis: {
    host: process.env.REDIS_HOST,
  },
});

expirationQueue.process(async job => {
  new ExpirationCompletePublisher(nats.client).publish({
    orderId: job.data.orderId,
  });
});

export { expirationQueue };
