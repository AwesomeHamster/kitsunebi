import { ConfBot as OicqConfig } from "oicq";

export interface BaseAdapterConfig {
  type: string;
  account: Account;
}

export interface OicqAdapterConfig extends BaseAdapterConfig {
  type: "oicq",
  config: OicqConfig;
}

export interface DiscordAdapterConfig extends BaseAdapterConfig {
  type: "discord",
  config: {
    token: string,
  };
}

export type AdapterConfig = OicqAdapterConfig | DiscordAdapterConfig;

export interface Account {
  id?: number;
  password?: string;
}

export interface CommandConfig {
  prefix: string;
}

export interface Meta {
  adapters: AdapterConfig[];
}

export interface ConfigFile {
  meta: Meta;
}

export {
  OicqConfig,
};
