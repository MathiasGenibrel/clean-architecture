#!/usr/bin/env node
import { Command } from "commander";
import {
  DateProvider,
  PostMessageCommand,
  PostMessageUsecase,
} from "./src/post-message.usecase";
import { MessageFsRepository } from "./src/message.fs.repository";

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

program
  .name("Tweet")
  .description("Social to test clean architecture")
  .version("1.0.0");

program
  .command("post")
  .description("Create a new post on user timeline")
  .argument("<user>", "The current user")
  .argument("<message>", "The message to post")
  .action(async (user, message) => {
    const postMessageCommand: PostMessageCommand = {
      id: "message-id",
      text: message,
      author: user,
    };

    try {
      await postMessageUsecase.handle(postMessageCommand);
      console.log("✅  Message posté");
    } catch (err) {
      console.log("❌", err);
    }
  });

const bootstrap = async () => await program.parseAsync();

bootstrap();
