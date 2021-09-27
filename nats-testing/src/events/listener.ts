import { Message, Stan } from 'node-nats-streaming';
import { Subjects } from './subjects';

interface Event {
  subject: Subjects;
  data: any;
}

abstract class Listener<T extends Event> {
  abstract subject: T['subject'];
  abstract queueGroupName: string;
  abstract onMessage(data: T['data'], msg: Message): void;
  private client: Stan;
  protected ackWait = 5 * 1000;

  constructor(client: Stan) {
    this.client = client;
  }

  private subscriptionOptions() {
    return this.client
      .subscriptionOptions()
      .setAckWait(this.ackWait)
      .setManualAckMode(true) // we will need to manually acknowldge that the event was correctly processed
      .setDeliverAllAvailable() // gives us all events that have been published in the past
      .setDurableName(this.queueGroupName); // associates the past events to this subscription
  }

  listen() {
    const subscription = this.client.subscribe(
      this.subject,
      this.queueGroupName,
      this.subscriptionOptions(),
    );

    subscription.on('message', (msg: Message) => {
      console.log(`Message received: ${this.subject} / ${this.queueGroupName}`);

      const data = msg.getData();
      const str = typeof data === 'string' ? data : data.toString('utf8');
      const parsedData = JSON.parse(str);

      this.onMessage(parsedData, msg);

      msg.ack(); // this acknowleges that the event was processed correctly
    });
  }
}

export { Listener };
