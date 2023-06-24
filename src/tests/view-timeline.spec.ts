import { createMessagingFixture, MessagingFixture } from "./messaging.fixture";
import { MessagingBuilder } from "./messaging.builder";

describe("Feature: View timeline", () => {
  let fixture: MessagingFixture;

  beforeEach(() => {
    fixture = createMessagingFixture();
  });

  describe("Rule: Messages appear in reverse chronological order", () => {
    test("Alice can see the 3 messages she posted in her timeline", async () => {
      const aliceMessage = new MessagingBuilder().authoredBy("Alice");

      await fixture.getExistingTimeline([
        aliceMessage
          .withId("perfect-id")
          .withText("Perfect day !")
          .publishedAt(new Date("2023-01-19T14:16:34.943Z"))
          .build(),
        aliceMessage
          .withId("how-id")
          .withText("How are you ?")
          .publishedAt(new Date("2023-01-19T14:15:34.943Z"))
          .build(),
        new MessagingBuilder()
          .withId("notch-id")
          .authoredBy("Notch")
          .withText("Never dig down!")
          .publishedAt(new Date("2023-01-19T14:14:34.198Z"))
          .build(),
        aliceMessage
          .withId("hello-id")
          .withText("Hello World!")
          .publishedAt(new Date("2023-01-19T14:14:32.875Z"))
          .build(),
      ]);
      fixture.givenNowIs(new Date("2023-01-19T14:16:35.000Z"));

      await fixture.whenUserViewTimeline("Alice");

      fixture.thenTimelineShouldBe([
        {
          author: "Alice",
          text: "Perfect day !",
          wasPublished: "Less than a minute ago",
        },
        {
          author: "Alice",
          text: "How are you ?",
          wasPublished: "1 minute ago",
        },
        {
          author: "Alice",
          text: "Hello World!",
          wasPublished: "2 minutes ago",
        },
      ]);
    });
  });
});
