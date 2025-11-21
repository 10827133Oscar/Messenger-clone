import { Types } from 'mongoose';

export interface IUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
  emailVerified?: Date;
  image?: string;
  hashedPassword?: string;
  createdAt: Date;
  updatedAt: Date;
  conversationIds: Types.ObjectId[];
  seenMessageIds: Types.ObjectId[];
}

export interface IMessage {
  _id: Types.ObjectId;
  body?: string;
  image?: string;
  createdAt: Date;
  seenIds: Types.ObjectId[];
  conversationId: Types.ObjectId;
  senderId: Types.ObjectId;
  sender?: IUser;
  seen?: IUser[];
}

export interface IConversation {
  _id: Types.ObjectId;
  createdAt: Date;
  lastMessageAt: Date;
  name?: string;
  isGroup?: boolean;
  messagesIds: Types.ObjectId[];
  userIds: Types.ObjectId[];
  users?: IUser[];
  messages?: IMessage[];
}

export type FullMessageType = IMessage & {
  sender: IUser;
  seen: IUser[];
};

export type FullConversationType = IConversation & {
  users: IUser[];
  messages: FullMessageType[];
};
