#!/usr/bin/env node
import { Command } from "commander";
import {
  DateProvider,
  PostMessageCommand,
  PostMessageUsecase,
} from "./src/post-message.usecase";
import { MessageFsRepository } from "./src/message.fs.repository";
import { ViewTimelineUseCase } from "./src/view-timeline.usecase";

const program = new Command();

const messageRepository = new MessageFsRepository();

class RealDateProvider implements DateProvider {
  getNow(): Date {
    return new Date();
  }
}

const dateProvider = new RealDateProvider();

const postMessageUsecase = new PostMessageUsecase(
  messageRepository,
  dateProvider
);

const viewTimelineUseCase = new ViewTimelineUseCase(
  messageRepository,
  dateProvider
);

program
  .name("Tweet")
  .description("Social to test clean architecture")
  .version("1.0.0");

program
  .command("post")
  .description("Create a new post on user timeline")
  .argument("<author>", "The current user")
  .argument("<message>", "The message to post")
  .action(async (author, message) => {
    const postMessageCommand: PostMessageCommand = {
      id: `${Math.round(Math.random() * 10_000)}`,
      text: message,
      author: author,
    };

    try {
      await postMessageUsecase.handle(postMessageCommand);
      console.log("✅  Message posté");
    } catch (err) {
      console.log("❌", err);
    }
  });

program
  .command("view")
  .description("View the timeline of an user")
  .argument("<author>", "The current author")
  .action(async (author) => {
    try {
      const messagesOfAuthor = await viewTimelineUseCase.handle(author);
      console.table(messagesOfAuthor);
    } catch (err) {
      console.log("❌", err);
    }
  });

const bootstrap = async () => await program.parseAsync();

bootstrap();
