import { createMessagingFixture, MessagingFixture } from "./messaging.fixture";
import { MessagingBuilder } from "./messaging.builder";

describe("Feature: Editing a message", () => {
  let fixture: MessagingFixture;

  beforeEach(() => {
    fixture = createMessagingFixture();
  });

  describe("Rule: A message can contain a maximum of 280 characters", () => {
    it("Alice can edit one of the messahes she has posted", () => {
      const aliceMessage = new MessagingBuilder()
        .withId("message-id")
        .withText("Hello Wrld!")
        .authoredBy("Alice");

      fixture.givenMessage(aliceMessage.build());

      fixture.whenUserEditAmessage(
        aliceMessage.withText("Hello World!").build()
      );

      fixture.thenMessageShouldBe(aliceMessage.withText("Hello Wrld!").build());
    });
  });
});
