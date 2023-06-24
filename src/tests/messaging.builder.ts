import { Message } from "../types/message";

export class MessagingBuilder {
  private props: Message;

  constructor() {
    // Set the default value of the props
    this.props = {
      id: "DEFAULT-ID",
      author: "DEFAULT",
      text: "DEFAULT MESSAGE",
      publishedAt: new Date("2023-01-01T19:00:00.000Z"),
    };
  }

  public withId(id: string) {
    this.props = { ...this.props, id };
    return this;
  }
  public withText(text: string) {
    this.props = { ...this.props, text };
    return this;
  }
  public authoredBy(author: string) {
    this.props = { ...this.props, author };
    return this;
  }
  public publishedAt(date: Date) {
    this.props = { ...this.props, publishedAt: date };
    return this;
  }

  public build() {
    return this.props;
  }
}
