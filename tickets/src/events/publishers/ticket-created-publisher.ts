import {
  Publisher,
  Subjects,
  TicketCreatedEvent,
} from '@udemy-ts-tickets/common';

class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}

export { TicketCreatedPublisher };
