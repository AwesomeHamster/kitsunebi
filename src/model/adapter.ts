import { Session } from "./session";

export interface Adapter {
  emit<K extends EventType>(event: K, ...params: Parameters<EventMap[K]>): boolean;

  on<K extends EventType>(event: K, listener: EventMap[K]): Adapter;
}

export interface EventMap {
  "message"(session: Session): void;
  "message.group"(session: Session): void;
  "message.private"(session: Session): void;
}

export type EventType = keyof EventMap;
