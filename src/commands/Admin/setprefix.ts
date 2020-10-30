import { SettingsModel } from "../../models/settings/settings.model";
import { Command } from "../../types/command.types";

const Ping: Command = {
  conf: {
    guildOnly: true,
    permLevel: "Admin",
    enabledDefault: true,
  },
  help: {
    name: "setprefix",
    category: "Admin",
    description: "Change the bot prefix for your server.",
    usage: "setprefix [prefix]"
  },
  run: async function(client, message, args) {
    if (!args[0]) return message.reply("No prefix specified. Try again!");

    const prefix: string = args[0];

    if (prefix.length > 3) {
      return message.reply("Prefix should be 3 characters or less");
    } 
    if (!(/^(\w|\d|!|\$|%|\^|&|\*|<|>|~|`|\/|\\){1,3}$/.test(prefix))) {
      return message.reply("Prefix contains not allowed characters");
    }
    
    try {
      await SettingsModel.updateOne(
        { guildId: message.guild?.id },
        {
          $set: {
            prefix: prefix
          }
        }
      )
      return message.reply("Guild Settings have been updated");
    } catch (error) {
      client.logger.error(error);
    }
  }
}

export default Ping;