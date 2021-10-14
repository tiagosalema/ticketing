import {
  Publisher,
  Subjects,
  TicketUpdatedEvent,
} from '@udemy-ts-tickets/common';

class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}

export { TicketUpdatedPublisher };
