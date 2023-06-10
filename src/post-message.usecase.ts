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
  save: (msg: Message) => void;
}

export interface DateProvider {
  getNow: () => Date;
}

export class PostMessageUsecase {
  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly dateProvider: DateProvider
  ) {}

  handle(messagePostedCommand: PostMessageCommand) {
    this.messageRepository.save({
      id: messagePostedCommand.id,
      text: messagePostedCommand.text,
      author: messagePostedCommand.author,
      publishedAt: this.dateProvider.getNow(),
    });
  }
}
