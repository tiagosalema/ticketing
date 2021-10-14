import {
  Publisher,
  Subjects,
  OrderCancelledEvent,
} from '@udemy-ts-tickets/common';

class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}

export { OrderCancelledPublisher };
