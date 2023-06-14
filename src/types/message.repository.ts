import { Message } from "./message";

export interface MessageRepository {
  save: (msg: Message) => Promise<void>;
  getMessagesByAuthor: (author: string) => Promise<Message[]>;
}
