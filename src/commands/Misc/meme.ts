import { Command } from "../../types/command.types";

const Ping: Command = {
  conf: {
    guildOnly: false,
    permLevel: "User",
    enabledDefault: true,
  },
  help: {
    name: "meme",
    category: "Misc",
    description: "Sends you a generated meme",
    usage: "meme [meme_name] [text_top] [text_bottom]"
  },
  run: async function(client, message, args) {
    const input = args.join(" ");
    const regex = /\[(?<memeName>.*)\] \[(?<textTop>.*)\] \[(?<textBottom>.*)\]/;
    const result = input.match(regex);

    if (!result?.groups) return message.reply("Look at the format again with help command");
    if (!result.groups.memeName || !result.groups.textTop || !result.groups.textBottom) {
      return message.reply("Include all fields please");
    }

    const { memeName, textTop, textBottom } = result.groups;

    return message.reply(encodeURI(`https://urlme.me/${memeName}/${textTop}/${textBottom}.jpg`));
  }
}

export default Ping;