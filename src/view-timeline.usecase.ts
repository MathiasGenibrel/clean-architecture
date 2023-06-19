import { MessageRepository } from "./types/message.repository";
import { DateProvider } from "./post-message.usecase";

export type Post = {
  text: string;
  author: string;
  wasPublished: string;
};

const ONE_MINUTE_IN_MS = 60_000;

export class ViewTimelineUseCase {
  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly dateProvider: DateProvider
  ) {}

  async handle(author: string): Promise<Post[]> {
    const messages = await this.messageRepository.getMessagesByAuthor(author);
    const sortedMessages = messages.sort(
      (msgA, msgB) => msgB.publishedAt.getTime() - msgA.publishedAt.getTime()
    );

    return sortedMessages.map((message) => {
      return {
        author: message.author,
        text: message.text,
        wasPublished: this.getPublicationTime(message.publishedAt),
      };
    });
  }

  private getPublicationTime(publishedAt: Date): string {
    const now = this.dateProvider.getNow();
    const diff = now.getTime() - publishedAt.getTime();
    const minute = Math.floor(diff / ONE_MINUTE_IN_MS);

    if (minute < 1) return "Less than a minute ago";
    if (minute >= 2) return `${minute} minutes ago`;
    return "1 minute ago";
  }
}
