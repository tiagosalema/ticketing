import {
  Publisher,
  Subjects,
  OrderCreatedEvent,
} from '@udemy-ts-tickets/common';

class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}

export { OrderCreatedPublisher };
