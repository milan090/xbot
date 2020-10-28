import { Schema } from "mongoose";
import { findOneOrCreate } from "./settings.statics";
import { defaultSettings } from "../../config.json";

const SettingsSchema: Schema = new Schema({
  guildId: {
    type: String,
    required: true,
  },
  prefix: {
    type: String,
    default: defaultSettings.prefix,
  },
  enabledCommands: {
    type: Array,
    required: true,
  },
  welcomeEnabled: {
    type: Boolean,
    default: defaultSettings.welcomeEnabled,
  },
  welcomeChannelId: {
    type: String,
  }
});

SettingsSchema.statics.findOneOrCreate = findOneOrCreate;

export default SettingsSchema;