import { Message } from "../types/message";
import { Post, ViewTimelineUseCase } from "../view-timeline.usecase";
import { InMemoryMessageRepository } from "../inmemory-message.repository";
import { StubDateProvider } from "../stub-date-provider";
import {
  PostMessageCommand,
  PostMessageUsecase,
} from "../post-message.usecase";

export const createMessagingFixture = () => {
  let timeline: Post[];
  let thrownError: Error;

  const messageRepository = new InMemoryMessageRepository();
  const dateProvider = new StubDateProvider();

  // Introduction of different use cases

  const viewTimelineUseCase = new ViewTimelineUseCase(
    messageRepository,
    dateProvider
  );

  const postMessageUsecase = new PostMessageUsecase(
    messageRepository,
    dateProvider
  );

  return {
    givenNowIs(_now: Date) {
      dateProvider.now = _now;
    },
    getExistingTimeline: async (messages: Message[]) => {
      await messageRepository.bulkSave(messages);
    },
    givenMessage: async (msg: Message) => {
      await messageRepository.save(msg);
    },

    whenUserViewTimeline: async (author: string) => {
      timeline = await viewTimelineUseCase.handle(author);
    },
    whenUserPostAmessage: async (postMessageCommand: PostMessageCommand) => {
      try {
        await postMessageUsecase.handle(postMessageCommand);
      } catch (err) {
        thrownError = err as Error;
      }
    },
    whenUserEditAmessage: async (editMessageCommand: PostMessageCommand) => {},

    thenMessageShouldBe: async (expectedMessage: Message) => {
      expect(expectedMessage).toEqual(
        await messageRepository.getMessageById(expectedMessage.id)
      );
    },
    thenTimelineShouldBe: (expectedTimeline: Post[]) => {
      expect(timeline).toEqual(expectedTimeline);
    },
    thenErrorShouldBe(expectedErrorClass: new () => Error) {
      expect(thrownError).toBeInstanceOf(expectedErrorClass);
    },
  };
};

export type MessagingFixture = ReturnType<typeof createMessagingFixture>;
