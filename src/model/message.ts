export interface BaseElement {
  type: string;
}

export interface TextElement extends BaseElement {
  type: "text";
  text: string;
}

export type MessageElement = BaseElement | TextElement;

export type Message = MessageElement | MessageElement[];
