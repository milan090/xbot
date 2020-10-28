import { ISettingsModel, ISettingsDocument } from "./settings.types";
import { defaultSettings } from "../../config.json";
import logger from "../../config/winston";

export async function findOneOrCreate(
  this: ISettingsModel,
  guildId: string
): Promise<ISettingsDocument | undefined> {
  try {
    const record = await this.findOne({ guildId: guildId });
    if (record) {
      return record;
    } else {
      return this.create({
        guildId: guildId,
        enabledCommands: defaultSettings.enabledCommands,
        prefix: defaultSettings.prefix,
        welcomeEnabled: defaultSettings.welcomeEnabled
      })
    }
  } catch (error) {
    logger.error(error);
  }
}