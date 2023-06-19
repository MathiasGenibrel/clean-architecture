import { DateProvider } from "./post-message.usecase";

export class StubDateProvider implements DateProvider {
  // @ts-ignore
  now: Date;

  getNow(): Date {
    return this.now;
  }
}
