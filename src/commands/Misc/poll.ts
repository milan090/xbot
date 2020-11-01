import { Message, MessageEmbed, MessageReaction } from "discord.js";
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
    name: "poll",
    category: "Misc",
    description: "Help command displays all available commands and their usage",
    usage: "poll \"poll question goes here\" \"option 1\" \"option 2\".... <POLL_TIMEOUT_MINUTES>(default 3 minutes)",
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
          const emojiOptions: Array<{emoji: string, option: string}> = optionsEmojies.slice(0, options.length)
            .map((emoji, i) => ({
              emoji: emoji,
              option: options[i]
            }))

          const msgBodyOptions = emojiOptions
            .map((emojiOption) => `${emojiOption.emoji} ${emojiOption.option}`)
            .join("\n");

          const embeded = client.newMessageEmbed(
            `Q: ${question}`,
            msgBodyOptions
          );

          const sentMessage: Message = await message.channel.send(
            `:bar_chart: Poll by ${message.author}`,
            embeded
          );

          const pollTimeout: number = parseFloat(args[args.length-1]) || 3;
          const filter = (reaction: MessageReaction) => {
            return emojiOptions.map(e => e.emoji).includes(reaction.emoji.name);
          };

          sentMessage.awaitReactions(filter, { time: pollTimeout*1000*60 })
            .then(collected => {
              const totalVotes: number = collected.array().reduce((acc, e) => {
                return (e.count || 1) - 1 + acc;
              }, 0);
              const embed: MessageEmbed = client.newMessageEmbed(
                `Results of Poll Q: **${question}**`,
                emojiOptions.map(e => {
                  const votes: number = collected.get(e.emoji)?.count || 1;
                  return `**${e.option}**: ${(((votes) - 1)/totalVotes) * 100}%`
                }).join("\n")
              )
              message.channel.send(embed);
            })

          if (message.guild?.me?.hasPermission("MANAGE_MESSAGES")) message.delete();
          
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
