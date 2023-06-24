import { MessageIsEmpty, MessageTooLongError } from "../post-message.usecase";
import { createMessagingFixture, MessagingFixture } from "./messaging.fixture";
import { MessagingBuilder } from "./messaging.builder";

describe("Feature: Posting a message", () => {
  let fixture: MessagingFixture;
  beforeEach(() => {
    fixture = createMessagingFixture();
  });

  describe("Rule: A message can contain a maximum of 280 characters", () => {
    test("Alice can post a message on her timeline", async () => {
      fixture.givenNowIs(new Date("2023-01-19T19:00:00.000Z"));

      await fixture.whenUserPostAmessage({
        id: "message-id",
        text: "Hello World!",
        author: "Alice",
      });

      await fixture.thenMessageShouldBe(
        new MessagingBuilder()
          .withId("message-id")
          .withText("Hello World!")
          .authoredBy("Alice")
          .publishedAt(new Date("2023-01-19T19:00:00.000Z"))
          .build()
      );
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
