import { Message } from 'node-nats-streaming';
import { Listener } from './listener';
import { Subjects } from './subjects';
import { TicketCreatedEvent } from './ticket-created-event';

class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
  queueGroupName = 'payments-service';

  onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    console.log(
      'Listened to event data. I can do whatever I want with it now...',
      data,
    );
  }
}

export { TicketCreatedListener };
