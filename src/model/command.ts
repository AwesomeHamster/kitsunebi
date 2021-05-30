import { Client } from "oicq";
import { Argv } from "yargs";

export interface Action {
  bot: Client,
  command: string,
  reply: (message: string) => void;
  [s: string]: unknown;
}

export interface CommandModule {
  command: string | readonly string[];
  description?: string;
  builder: (yargs: Argv) => Argv;
  action: (action: Action) => void;
}
