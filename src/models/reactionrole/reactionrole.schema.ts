import { Schema } from "mongoose";
import { defaultSettings } from "../../config.json";

const ReactionRoleSchema: Schema = new Schema({
  guildId: {
    type: String,
    required: true,
  },
  channelId: {
    type: String,
    required: true,
  },
  messageId: {
    type: String,
    default: defaultSettings.prefix,
  },
  emojiRoleIds: {
    type: Map,
    required: true
  }
});


export default ReactionRoleSchema;