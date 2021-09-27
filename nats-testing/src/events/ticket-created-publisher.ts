import { Publisher } from './publisher';
import { Subjects } from './subjects';
import { TicketCreatedEvent } from './ticket-created-event';

class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}

export { TicketCreatedPublisher };
