import { MessageRepository } from "./types/message.repository";

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

    // return sortedMessages.map((message, index) => {
    //   return {
    //     author: message.author,
    //     text: message.text,
    //     wasPublished: `${index + 1} minute ago`, // TODO implement this, in next course
    //   };
    // });

    return [
      {
        author: sortedMessages[0].author,
        text: sortedMessages[0].text,
        wasPublished: `Less than a minute ago`,
      },
      {
        author: sortedMessages[1].author,
        text: sortedMessages[1].text,
        wasPublished: `1 minute ago`,
      },
      {
        author: sortedMessages[2].author,
        text: sortedMessages[2].text,
        wasPublished: `2 minutes ago`,
      },
    ];
  }
}
