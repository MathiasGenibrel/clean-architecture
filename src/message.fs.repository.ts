import * as fs from "fs/promises";
import * as path from "path";
import { MessageRepository } from "./types/message.repository";
import { Message } from "./types/message";

export class MessageFsRepository implements MessageRepository {
  private readonly filePath = path.join(__dirname, "message.json");
  async save(msg: Message): Promise<void> {
    const messages = await this.getMessages();
    messages.push(msg);

    return fs.writeFile(this.filePath, JSON.stringify(messages));
  }

  async getMessagesByAuthor(author: string): Promise<Message[]> {
    const messages = await this.getMessages();

    return messages.filter((msg) => msg.author === author);
  }

  private async getMessages(): Promise<Message[]> {
    const data = await fs.readFile(this.filePath);
    const messages = JSON.parse(data.toString()) as {
      id: string;
      text: string;
      author: string;
      publishedAt: string;
    }[];

    return messages.map((msg) => ({
      id: msg.id,
      author: msg.author,
      text: msg.text,
      publishedAt: new Date(msg.publishedAt),
    }));
  }
}
