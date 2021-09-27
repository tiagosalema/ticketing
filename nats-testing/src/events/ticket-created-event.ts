import { Subjects } from './subjects';

interface TicketCreatedEvent {
  subject: Subjects;
  data: {
    id: string;
    title: string;
    price: number;
  };
}

export { TicketCreatedEvent };
