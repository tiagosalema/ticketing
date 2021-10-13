import { Message } from 'node-nats-streaming';
import {
  Listener,
  Subjects,
  TicketCreatedEvent,
} from '@udemy-ts-tickets/common';

import { Ticket } from '../../models/ticket';
import { queueGroupName } from './queue-group-name';

class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject = Subjects.TicketCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    const { id, title, price } = data;
    const ticket = Ticket.build({ id, title, price });
    await ticket.save();
  }
}
export { TicketCreatedListener };
