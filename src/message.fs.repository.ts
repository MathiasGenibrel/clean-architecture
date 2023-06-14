import * as fs from "fs/promises";
import * as path from "path";
import { MessageRepository } from "./types/message.repository";
import { Message } from "./types/message";

export class MessageFsRepository implements MessageRepository {
  save(msg: Message): Promise<void> {
    return fs.writeFile(
      path.join(__dirname, "message.json"),
      JSON.stringify(msg)
    );
  }

  async getMessagesByAuthor(author: string): Promise<Message[]> {
    throw new Error("Not implemented");
  }
}
