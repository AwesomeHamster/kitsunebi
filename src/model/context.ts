export interface BaseMessageContext {
  timestamp: number;
  userId: string | number;
  userName?: string;
  realName?: string | { firstName: string, lastName: string };
  nickName?: string;
  remark?: string;
  email?: string;
  phone?: string;
}

export interface PrivateMessageContext extends BaseMessageContext{
  isFriend?: boolean;
}

export interface GroupMessageContext extends BaseMessageContext {
  groupId: string | number;
  channelId?: string;
  groupName?: string;
}

export type MessageContext = PrivateMessageContext | GroupMessageContext;

export type Context = MessageContext;
