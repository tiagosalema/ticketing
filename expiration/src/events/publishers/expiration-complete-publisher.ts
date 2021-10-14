import {
  Publisher,
  Subjects,
  ExpirationCompleteEvent,
} from '@udemy-ts-tickets/common';

class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}

export { ExpirationCompletePublisher };
