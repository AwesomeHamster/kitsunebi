import { Client, MessageElem } from "oicq";
import { Argv } from "yargs";

export interface Action {
  bot: Client,
  command: string,
  reply: (message: MessageElem | Iterable<MessageElem> | string) => Promise<void>;
  [s: string]: unknown;
}

export interface CommandConfig {
  permission: number;
}

export interface CommandModule {
  command: string | readonly string[];
  description?: string;
  builder: (yargs: Argv) => Argv;
  action: (action: Action) => void;
  config?: CommandConfig;
}
