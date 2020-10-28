import { Document, Model } from "mongoose";

export interface ISettings {
  guildId: string;
  prefix: string;
  enabledCommands: string[],
  welcomeEnabled: boolean;
  welcomeChannelId?: string;
}

export interface ISettingsDocument extends ISettings, Document {
  guildId: string;
}

export interface ISettingsModel extends Model<ISettingsDocument> {
  findOneOrCreate: (
    this: ISettingsModel,
    guildId: string,
  ) => Promise<ISettingsDocument>;
}