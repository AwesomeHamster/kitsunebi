import { Context } from "./context";
import { Message } from "./message";

export interface Session {
  /** current context */
  context: Context;
  /** message instance */
  message: Message;
  /** send message to current context */
  send(message: string): Promise<unknown>;
  send(message: Message): Promise<unknown>;
  send(message: unknown): Promise<unknown>;
}
