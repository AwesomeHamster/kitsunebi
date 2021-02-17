import EventEmitter from "events";
import { Client, createClient, MessageElem } from "oicq";
import { ConfigFile } from "./model/config";
import { Context, GroupMessageContext, PrivateMessageContext } from "./model/context";
import { Message } from "./model/message";
import { Session } from "./model/session";

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

    this.bot.on("message.group", (data) => {
      this.emit("message", new OicqSession(this.bot, {
        timestamp: data.time,
        userId: data.user_id,
        userName: data.sender.nickname,
        groupId: data.group_id,
        groupName: data.group_name,
      }, Util.fromOicqMessage(data.message)));
    });
  }

  login(): void {
    this.bot.login(this.config.account?.password);
  }

  emit<K extends EventType>(event: K, ...params: Parameters<EventMap[K]>): boolean {
    return this.receiver.emit(event, ...params);
  }

  on<K extends EventType>(event: K, listener: EventMap[K]): OicqAdapter {
    this.receiver.on(event, listener);
    return this;
  }
}

export class OicqSession implements Session {
  bot: Client;
  context: Context;
  message: Message;

  constructor(bot: Client, context: Context, message: Message) {
    this.bot = bot;
    this.context = context;
    this.message = message;
  }

  async send(message: string): Promise<unknown>;
  async send(message: Message): Promise<unknown>;
  async send(_message: unknown): Promise<unknown> {
    let userId: number;
    let message: Message;
    if (typeof (this.context.userId) === "string") {
      userId = parseInt(this.context.userId);
    } else {
      userId = this.context.userId;
    }
    if (typeof _message === "string") {
      message = [{
        type: "text",
        text: _message,
      }];
    } else {
      message = _message as Message;
    }
    if (this.isPrivate(this.context)){
      return await this.bot.sendPrivateMsg(userId, Util.toOicqMessage(message));
    } else if (this.isGroup(this.context)) {
      const groupId = (typeof this.context.groupId === "string") ?
        parseInt(this.context.groupId) :
        this.context.groupId;
      return await this.bot.sendGroupMsg(groupId, Util.toOicqMessage(message));
    }
  }

  private isPrivate(context: Context): context is PrivateMessageContext {
    return !("groupId" in context);
  }

  private isGroup(context: Context): context is GroupMessageContext {
    return ("groupId" in context);
  }
}

export class Util {
  static fromOicqMessage(message: string | MessageElem[]): Message {
    if (typeof message === "string") {
      return [{
        type: "text",
        text: message,
      }];
    } else {
      return message.map((elem) => {
        if (elem.type === "text") {
          return {
            type: "text",
            text: elem.data.text,
          };
        } else if (elem.type === "image") {
          return {
            type: "image",
            url: elem.data.url ?? "",
          };
        } else {
          return {
            type: "text",
            text: "",
          };
        }
      });
    }
  }

  static toOicqMessage(message: Message): MessageElem[] {
    return message.map((msg): MessageElem => {
      if (msg.type === "text") {
        return {
          type: "text",
          data: {
            text: msg.text,
          },
        };
      } else if (msg.type === "image") {
        let file = "";
        if (msg.url) file = msg.url;
        if (msg.file) file = "file:///" + msg.file;
        if (msg.base64) file = "base64://" + msg.base64;
        return {
          type: "image",
          data: {
            file: file,
          },
        };
      } else {
        return {
          type: "text",
          data: {
            text: "",
          },
        };
      }
    });
  }

}

interface EventMap {
  "message"(session: OicqSession): void;
}

export type EventType = keyof EventMap;
