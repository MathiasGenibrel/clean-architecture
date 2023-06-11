import {
  DateProvider,
  Message,
  MessageRepository,
  MessageTooLongError,
  PostMessageCommand,
  PostMessageUsecase,
} from "../post-message.usecase";

describe("Feature: Posting a message", () => {
  describe("Rule: A message can contain a maximum of 280 characters", () => {
    test("Alice can post a message on her timeline", () => {
      givenNowIs(new Date("2023-01-19T19:00:00.000Z"));

      whenUserPostAmessage({
        id: "message-id",
        text: "Hello World!",
        author: "Alice",
      });

      thenPostedMessageShouldBe({
        id: "message-id",
        text: "Hello World!",
        author: "Alice",
        publishedAt: new Date("2023-01-19T19:00:00.000Z"),
      });
    });

    test("Alice cannot post a message with more than 280 characters", () => {
      const textWidthLengthOf281 =
        "nufrhscodbrkzcdccsbvhskgimqmcnprzsvxhkcaqftjfkqkhbkpowywfkvisquergtkdptfhpforzgeyjrhdjffmanwqpamrohxslifeadctmhigunxmlyiiyntbbnxjfowsceqndcyvkhrmaunonhpogskyyjylcsgtktettojsdvnygnhgvgloghrfdreavsofomnkrjixuixmtjtkwpqvvmnmryycfrtrbeoztayarrvsdieqfdlsbknxoxzdbfnimnwxctjpbwxzkppujsyh";

      givenNowIs(new Date("2023-01-19T19:00:00.000Z"));

      whenUserPostAmessage({
        id: "message-id",
        text: textWidthLengthOf281,
        author: "Alice",
      });

      thenErrorShouldBe(MessageTooLongError);
    });
  });
});

let message: Message;
let thrownError: Error;

class InMemoryMessageRepository implements MessageRepository {
  save(msg: Message): void {
    message = msg;
  }
}

class StubDateProvider implements DateProvider {
  // @ts-ignore
  now: Date;

  getNow(): Date {
    return this.now;
  }
}

const messageRepository = new InMemoryMessageRepository();
const dateProvider = new StubDateProvider();

const postMessageUsecase = new PostMessageUsecase(
  messageRepository,
  dateProvider
);

function givenNowIs(_now: Date) {
  dateProvider.now = _now;
}

function whenUserPostAmessage(postMessageCommand: PostMessageCommand) {
  try {
    postMessageUsecase.handle(postMessageCommand);
  } catch (err) {
    thrownError = err as MessageTooLongError;
  }
}

function thenPostedMessageShouldBe(expectedMessage: Message) {
  expect(expectedMessage).toEqual(message);
}

function thenErrorShouldBe(expectedErrorClass: new () => Error) {
  expect(thrownError).toBeInstanceOf(expectedErrorClass);
}
