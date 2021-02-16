import EventEmitter from "events";
import { Client, createClient } from "oicq";
import { ConfigFile } from "./model/config";
import { Message } from "./model/message";

export class OicqAdapter {
  bot: Client;

  config: ConfigFile;

  receiver: EventEmitter;

  constructor(config: ConfigFile) {
    this.config = config;

    if (!config.account) {
      throw new Error("\"account\" not exist in config.");
    }

    if (!config.account.id || !config.account.password) {
      throw new Error("\"id\" and/or \"password\" not exist in config.");
    }
    this.bot = createClient(config.account.id, config.meta?.config);

    this.receiver = new EventEmitter();

    this.registerListeners();
    this.login();
  }

  private registerListeners(): void {
    // Slider reCaptcha
    this.bot.on("system.login.slider", () => {
      process.stdin.once("data", (input) => {
        this.bot.sliderLogin(String(input));
      });
    });

    // device lock
    this.bot.on("system.login.device", () => {
      this.bot.logger.info("Press Enter...");
      process.stdin.once("data", () => {
        this.bot.login();
      });
    });

    this.bot.on("message", (data) => {
      this.emit("message", {
        type: "text",
        text: data.raw_message,
      });
    });
  }

  private login(): void {
    this.bot.login(this.config.account?.password);
  }

  private emit<K extends EventType>(event: K, ...params: Parameters<EventMap[K]>): boolean {
    return this.receiver.emit(event, ...params);
  }

  on<K extends EventType>(event: K, listener: EventMap[K]): OicqAdapter {
    this.receiver.on(event, listener);
    return this;
  }
}

interface EventMap {
  "message"(data: Message): void;
}

export type EventType = keyof EventMap;
