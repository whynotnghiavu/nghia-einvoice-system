import { ClientsModule, Transport } from '@nestjs/microservices';

export class QueueConfig {
  static configs() {
    return ClientsModule.register([
      {
        name: 'MESSAGE_QUEUE_EVENT',
        transport: Transport.NATS,
        options: {
          servers: [process.env.NATS_HOST],
        },
      },
    ]);
  }
}
