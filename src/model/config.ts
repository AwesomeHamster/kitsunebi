import { ConfBot } from "oicq";

export interface Meta {
  account: {
    id: number;
    password: string;
  };
  config: ConfBot;
}

export interface ConfigFile {
  meta: Meta;
}
