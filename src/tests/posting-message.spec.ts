import {
  DateProvider,
  MessageIsEmpty,
  MessageTooLongError,
  PostMessageCommand,
  PostMessageUsecase,
} from "../post-message.usecase";
import { InMemoryMessageRepository } from "../inmemory-message.repository";
import { Message } from "../types/message";

describe("Feature: Posting a message", () => {
  let fixture: Fixture;
  beforeEach(() => {
    fixture = createFixture();
  });

  describe("Rule: A message can contain a maximum of 280 characters", () => {
    test("Alice can post a message on her timeline", async () => {
      fixture.givenNowIs(new Date("2023-01-19T19:00:00.000Z"));

      await fixture.whenUserPostAmessage({
        id: "message-id",
        text: "Hello World!",
        author: "Alice",
      });

      await fixture.thenPostedMessageShouldBe({
        id: "message-id",
        text: "Hello World!",
        author: "Alice",
        publishedAt: new Date("2023-01-19T19:00:00.000Z"),
      });
    });

    test("Alice cannot post a message with more than 280 characters", async () => {
      const textWidthLengthOf281 =
        "nufrhscodbrkzcdccsbvhskgimqmcnprzsvxhkcaqftjfkqkhbkpowywfkvisquergtkdptfhpforzgeyjrhdjffmanwqpamrohxslifeadctmhigunxmlyiiyntbbnxjfowsceqndcyvkhrmaunonhpogskyyjylcsgtktettojsdvnygnhgvgloghrfdreavsofomnkrjixuixmtjtkwpqvvmnmryycfrtrbeoztayarrvsdieqfdlsbknxoxzdbfnimnwxctjpbwxzkppujsyh";

      fixture.givenNowIs(new Date("2023-01-19T19:00:00.000Z"));

      await fixture.whenUserPostAmessage({
        id: "message-id",
        text: textWidthLengthOf281,
        author: "Alice",
      });

      fixture.thenErrorShouldBe(MessageTooLongError);
    });
  });

  describe("Rule: A message cannot be empty", () => {
    test("Alice cannot post an empty message", async () => {
      fixture.givenNowIs(new Date("2023-01-19T19:00:00.000Z"));

      await fixture.whenUserPostAmessage({
        id: "message-id",
        text: "",
        author: "Alice",
      });

      fixture.thenErrorShouldBe(MessageIsEmpty);
    });

    test("Alice cannot post a message with only whitespaces", async () => {
      fixture.givenNowIs(new Date("2023-01-19T19:00:00.000Z"));

      await fixture.whenUserPostAmessage({
        id: "message-id",
        text: "     ",
        author: "Alice",
      });

      fixture.thenErrorShouldBe(MessageIsEmpty);
    });
  });
});

class StubDateProvider implements DateProvider {
  // @ts-ignore
  now: Date;

  getNow(): Date {
    return this.now;
  }
}

const createFixture = () => {
  let thrownError: Error;

  const messageRepository = new InMemoryMessageRepository();
  const dateProvider = new StubDateProvider();

  const postMessageUsecase = new PostMessageUsecase(
    messageRepository,
    dateProvider
  );

  return {
    givenNowIs(_now: Date) {
      dateProvider.now = _now;
    },
    async whenUserPostAmessage(postMessageCommand: PostMessageCommand) {
      try {
        await postMessageUsecase.handle(postMessageCommand);
      } catch (err) {
        thrownError = err as Error;
      }
    },
    async thenPostedMessageShouldBe(expectedMessage: Message) {
      expect(expectedMessage).toEqual(
        await messageRepository.getMessageById(expectedMessage.id)
      );
    },
    thenErrorShouldBe(expectedErrorClass: new () => Error) {
      expect(thrownError).toBeInstanceOf(expectedErrorClass);
    },
  };
};

type Fixture = ReturnType<typeof createFixture>;
