import EventEmitter from "events";
import { Client, DMChannel, NewsChannel, TextChannel } from "discord.js";
import { Adapter, EventMap, EventType } from "../model/adapter";
import { DiscordAdapterConfig } from "../model/config";
import { Session } from "../model/session";
import { Context } from "../model/context";
import { Message } from "../model/message";

export class DiscordAdapter implements Adapter {
  bot: Client;
  config: DiscordAdapterConfig;
  receiver: EventEmitter;

  constructor(config: DiscordAdapterConfig) {
    this.config = config;
    this.bot = new Client();

    this.receiver = new EventEmitter();

    this.registerListener();
    this.login();
  }

  private registerListener() {
    this.bot.on("message", (data) => {
      this.emit("message", new DiscordSession(this.bot, {
        timestamp: data.createdAt.getMilliseconds(),
        userId: data.author.id,
      }, [{
        type: "text",
        text: data.content,
      }], data.channel));
    });
  }

  login(): void {
    this.bot.login(this.config.config.token);
  }

  emit<K extends EventType>(event: K, ...params: Parameters<EventMap[K]>): boolean {
    return this.receiver.emit(event, ...params);
  }

  on<K extends EventType>(event: K, listener: EventMap[K]): Adapter {
    this.receiver.on(event, listener);
    return this;
  }

  destroy(): void {
    this.bot.destroy();
  }
}

export class DiscordSession implements Session {
  bot: Client;
  context: Context;
  message: Message;
  channel: TextChannel | DMChannel | NewsChannel;

  constructor(bot: Client, context: Context, message: Message, channel: TextChannel | DMChannel | NewsChannel) {
    this.bot = bot;
    this.context = context;
    this.message = message;
    this.channel = channel;
  }

  send(message: string): Promise<unknown>;
  send(message: Message): Promise<unknown>;
  async send(message: unknown): Promise<unknown> {
    if (typeof message === "string") {
      return await this.channel.send(message);
    }
  }
}
