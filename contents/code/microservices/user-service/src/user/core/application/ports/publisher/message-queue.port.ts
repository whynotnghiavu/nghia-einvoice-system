export abstract class MessageQueuePort {
  abstract sendMessage(pattern: string, data: any);
}
