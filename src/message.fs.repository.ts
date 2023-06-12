import { MessageRepository, Message } from "./post-message.usecase";
import * as fs from "fs/promises";
import * as path from "path";

export class MessageFsRepository implements MessageRepository {
  save(msg: Message): Promise<void> {
    return fs.writeFile(
      path.join(__dirname, "message.json"),
      JSON.stringify(msg)
    );
  }
}
