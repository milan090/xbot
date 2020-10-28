import { SettingsModel } from "../../models/settings/settings.model";
import { Command } from "../../types/command.types";

const Ping: Command = {
  conf: {
    guildOnly: true,
    permLevel: "Admin",
    enabledDefault: true,
  },

  help: {
    name: "Enable Welcome",
    category: "Admin",
    description:
      "Enable welcome message whenever a new member joins the Server",
    usage:
      "enablewelcome <channelId> to enable OR enablewelcome false to disable",
  },

  run: async function (client, message, args) {
    if (!args[0]) return;

    if (args[0].toLowerCase() === "false") {
      await SettingsModel.updateOne(
        { guildId: message.guild?.id },
        {
          $set: {
            welcomeEnabled: false
          }
        }
      )
      message.reply("Welcome messages will no longer be sent");
    } else if (message.guild?.channels.cache.get(args[0])?.type === "text") {
      await SettingsModel.updateOne(
        { guildId: message.guild.id },
        {
          $set: {
            welcomeEnabled: true,
            welcomeChannelId: args[0]
          }
        }
      )
      message.reply("Welcome messages will be send to this channel");
    } else {
      message.reply("Please specify a valid channel-id."); return;
    }
  },
};

export default Ping;
