import { Post, ViewTimelineUseCase } from "../view-timeline.usecase";
import { InMemoryMessageRepository } from "../inmemory-message.repository";
import { Message } from "../types/message";
import { StubDateProvider } from "../stub-date-provider";

describe("Feature: View timeline", () => {
  let fixture: Fixture;

  beforeEach(() => {
    fixture = createFixture();
  });

  describe("Rule: Messages appear in reverse chronological order", () => {
    test("Alice can see the 3 messages she posted in her timeline", async () => {
      await fixture.getExistingTimeline([
        {
          id: "perfect-id",
          author: "Alice",
          text: "Perfect day !",
          publishedAt: new Date("2023-01-19T14:16:34.943Z"),
        },
        {
          id: "how-id",
          author: "Alice",
          text: "How are you ?",
          publishedAt: new Date("2023-01-19T14:15:34.943Z"),
        },
        {
          id: "notch-id",
          author: "Notch",
          text: "Never dig down!",
          publishedAt: new Date("2023-01-19T14:14:34.198Z"),
        },
        {
          id: "hello-id",
          author: "Alice",
          text: "Hello World!",
          publishedAt: new Date("2023-01-19T14:14:32.875Z"),
        },
      ]);
      fixture.getDateNow(new Date("2023-01-19T14:16:39.177Z"));

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

const createFixture = () => {
  let timeline: Post[];
  const messageRepository = new InMemoryMessageRepository();
  const dateProvider = new StubDateProvider();

  dateProvider.now = new Date("2023-01-19T14:16:35.000Z");

  const viewTimelineUseCase = new ViewTimelineUseCase(
    messageRepository,
    dateProvider
  );

  return {
    getExistingTimeline: async (messages: Message[]) => {
      await messageRepository.bulkSave(messages);
    },
    getDateNow: (_now: Date) => {},
    whenUserViewTimeline: async (author: string) => {
      timeline = await viewTimelineUseCase.handle(author);
    },
    thenTimelineShouldBe: (expectedTimeline: Post[]) => {
      expect(timeline).toEqual(expectedTimeline);
    },
  };
};

type Fixture = ReturnType<typeof createFixture>;
