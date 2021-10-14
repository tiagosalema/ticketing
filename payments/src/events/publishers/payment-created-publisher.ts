import {
  Publisher,
  Subjects,
  PaymentCreatedEvent,
} from '@udemy-ts-tickets/common';

class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}

export { PaymentCreatedPublisher };
