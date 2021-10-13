import { Ticket } from '../ticket';

it('implements optimistic concurrency control', async () => {
  const ticket = Ticket.build({
    title: 'A ticket',
    price: 322,
    userId: 'dsklajf',
  });

  await ticket.save();

  const ticket_1 = await Ticket.findById(ticket.id);
  const ticket_2 = await Ticket.findById(ticket.id);

  ticket_1!.price = 1;
  ticket_2!.price = 1;

  await ticket_1!.save();

  // ticket 2 is supposed to fail upon save as its version doesn't match
  try {
    await ticket_2!.save();
  } catch (e) {
    return;
  }

  throw new Error("Shouldn't reach this point");
});

it('increments the version number on multiple saves', async () => {
  const ticket = Ticket.build({
    title: 'A ticket',
    price: 322,
    userId: 'dsklajf',
  });

  await ticket.save();
  expect(ticket.version).toEqual(0);
  await ticket.save();
  expect(ticket.version).toEqual(1);
});
