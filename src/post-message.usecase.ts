export type PostMessageCommand = {
  id: string;
  text: string;
  author: string;
};

export type Message = {
  id: string;
  text: string;
  author: string;
  publishedAt: Date;
};

export interface MessageRepository {
  save: (msg: Message) => Promise<void>;
  getMessagesByAuthor: (author: string) => Promise<Message[]>;
}

export interface DateProvider {
  getNow: () => Date;
}

export class MessageTooLongError extends Error {}
export class MessageIsEmpty extends Error {}

export class PostMessageUsecase {
  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly dateProvider: DateProvider
  ) {}

  async handle(messagePostedCommand: PostMessageCommand) {
    if (messagePostedCommand.text.length > 280) throw new MessageTooLongError();
    if (messagePostedCommand.text.trim().length === 0)
      throw new MessageIsEmpty();

    await this.messageRepository.save({
      id: messagePostedCommand.id,
      text: messagePostedCommand.text,
      author: messagePostedCommand.author,
      publishedAt: this.dateProvider.getNow(),
    });
  }
}
