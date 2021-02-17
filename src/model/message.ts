export interface BaseElement {
  type: string;
}

export interface TextElement extends BaseElement {
  type: "text";
  text: string;
}

export interface ImageElement extends BaseElement {
  type: "image";
  /** local path */
  file?: string;
  /** network url */
  url?: string;
  /** image file content */
  buffer?: Buffer;
  /** base64 encoded image content */
  base64?: string;
}

export type MessageElement = TextElement | ImageElement;

export type Message = MessageElement[];
