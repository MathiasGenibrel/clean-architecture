import { MessageRepository } from "./post-message.usecase";

export type Post = {
  text: string;
  author: string;
  wasPublished: string;
};

export class ViewTimelineUseCase {
  constructor(private readonly messageRepository: MessageRepository) {}

  async handle(author: string): Promise<Post[]> {
    const messages = await this.messageRepository.getMessagesByAuthor(author);
    const sortedMessages = messages.sort(
      (msgA, msgB) => msgB.publishedAt.getTime() - msgA.publishedAt.getTime()
    );

    return sortedMessages.map((message, index) => {
      return {
        author: message.author,
        text: message.text,
        wasPublished: `${index + 1} Minute ago`, // TODO implement this, in next course
      };
    });
  }
}
