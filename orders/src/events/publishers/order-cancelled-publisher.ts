import {
  Publisher,
  Subjects,
  OrderCancelledEvent,
} from '@udemy-ts-tickets/common';

class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject = Subjects.OrderCancelled;
}

export { OrderCancelledPublisher };
