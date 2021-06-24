import { ConfBot } from "oicq";

export interface Meta {
  account?: {
    id: number;
    password: string;
  };
  config: ConfBot;
}

export interface Manage {
  superuser?: number[];
}

export interface ConfigFile {
  meta: Meta;
  manage: Manage;
}
