import EventEmitter from "events";
import { Wechaty } from "wechaty";
import { Adapter, EventMap, EventType } from "../model/adapter";
import { WechatyAdapterConfig } from "../model/config";

export class WechatyAdapter implements Adapter {
  bot: Wechaty;
  config: WechatyAdapterConfig;
  receiver: EventEmitter;
  constructor(config: WechatyAdapterConfig) {
    this.config = config;

    this.bot = new Wechaty();

    this.receiver = new EventEmitter();
  }
  emit<K extends EventType>(event: K, ...params: Parameters<EventMap[K]>): boolean {
    throw new Error("Method not implemented.");
  }
  on<K extends EventType>(event: K, listener: EventMap[K]): Adapter {
    throw new Error("Method not implemented.");
  }
  destroy(): void {
    throw new Error("Method not implemented.");
  }
}