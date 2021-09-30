import {
  Publisher,
  Subjects,
  OrderCreatedEvent,
} from '@udemy-ts-tickets/common';

class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject = Subjects.OrderCreated;
}

export { OrderCreatedPublisher };
