import { MessageRepository } from "./types/message.repository";
import { Message } from "./types/message";

export class InMemoryMessageRepository implements MessageRepository {
  private messages: Map<string, Message> = new Map();

  async save(msg: Message): Promise<void> {
    this.messages.set(msg.id, msg);
  }

  async getMessageById(id: string): Promise<Message> {
    return this.messages.get(id)!;
  }

  async bulkSave(messages: Message[]): Promise<void> {
    messages.forEach((message) => this.messages.set(message.id, message));
  }

  async getMessagesByAuthor(author: string): Promise<Message[]> {
    return [...this.messages.values()].filter(
      (message) => message.author === author
    );
  }
}
