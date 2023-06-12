import { Message, MessageRepository } from "./post-message.usecase";

export class InMemoryMessageRepository implements MessageRepository {
  // @ts-ignore
  message: Message;

  save(msg: Message): void {
    this.message = msg;
  }
}
