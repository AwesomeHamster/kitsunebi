import { ConfBot as OicqConfig } from "oicq";

export interface Account {
  id?: number;
  password?: string;
}

export interface CommandConfig {
  prefix: string;
}

export interface Meta {
  config: OicqConfig;
}

export interface ConfigFile {
  account?: Account;
  meta?: Meta;
}

export {
  OicqConfig,
};
