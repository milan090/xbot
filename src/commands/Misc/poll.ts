import { Message } from "discord.js";
import { Command } from "../../types/command.types";

import { optionsEmojies } from "./_pollOptionEmojies.json";

const regex = /".+?"/g;

const Ping: Command = {
  conf: {
    guildOnly: true,
    permLevel: "User",
    enabledDefault: true,
  },
  help: {
    name: "Poll",
    category: "Misc",
    description: "Help command displays all available commands and their usage",
    usage: "poll \"poll question goes here\" \"option 1\" \"option 2\"....",
  },
  run: async function (client, message, args: string[]) {
    if (args[0]) {
      const msgBody: string = args.join(" ");
      const regexResult = msgBody.matchAll(regex);
      if (regexResult) {
        const options: Array<string> = [...regexResult]
          .map((match) => match[0])
          .map((e) => e.slice(1, e.length - 1));
        if (options.length > 2) {
          const question: string = options.shift() as string;
          const msgBodyOptions = options
            .map((option, i) => `${optionsEmojies[i]} ${option}`)
            .join("\n");
          const embeded = client.newMessageEmbed(
            `Q: ${question}`,
            msgBodyOptions
          );
          const sentMessage: Message = await message.channel.send(
            `:bar_chart: Poll by ${message.author}`,
            embeded
          );
          return optionsEmojies
            .slice(0, options.length)
            .forEach((optionsEmoji) => {
              sentMessage.react(optionsEmoji);
            });
        }
      }
    }
    return message.reply("Incorrect format, refer to help");
  },
};

export default Ping;
