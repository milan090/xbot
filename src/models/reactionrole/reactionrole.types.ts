import { Document, Model } from "mongoose";

export interface IReactionRole {
  guildId: string;
  channelId: string;
  messageId: string;
  emojiRoleIds: Map<string, string>
}

export interface IReactionRoleDocument extends IReactionRole, Document {}

export type IReactionRoleModel = Model<IReactionRoleDocument>