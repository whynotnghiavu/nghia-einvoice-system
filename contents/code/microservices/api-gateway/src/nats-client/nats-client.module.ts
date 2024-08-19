import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'API_GATEWAY',
        transport: Transport.NATS,
        options: {
          servers: [process.env.NATS_HOST],
        },
      },
    ]),
  ],
  exports: [
    ClientsModule.register([
      {
        name: 'API_GATEWAY',
        transport: Transport.NATS,
        options: {
          servers: [process.env.NATS_HOST],
        },
      },
    ]),
  ],
})
export class NatsClientModule {}
