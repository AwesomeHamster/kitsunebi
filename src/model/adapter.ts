import { Session } from "./session";

export interface Adapter {
  emit<K extends EventType>(event: K, ...params: Parameters<EventMap[K]>): boolean;

  on<K extends EventType>(event: K, listener: EventMap[K]): Adapter;
}

export interface EventMap {
  /** general message received */
  "message"(session: Session): void;
  /** public message from guild/group */
  "message.guild"(session: Session): void;
  /** private message from user */
  "message.user"(session: Session): void;
}

export type EventType = keyof EventMap;
