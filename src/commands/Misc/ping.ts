import { Message, MessageEmbed } from "discord.js";
import ClientBot from "../../types/clientbot.types";
import { Command } from "../../types/command.types";

const Ping: Command = {
  conf: {
    guildOnly: false,
    permLevel: "User",
    enabledDefault: true,
  },
  help: {
    name: "ping",
    category: "Misc",
    description: "The classic ping! Returns network and API latency",
    usage: "ping"
  },
  run: async function(client: ClientBot, message: Message) {
    const msg: Message = await message.reply("Wait a sec...");
    const embed: MessageEmbed = client.newMessageEmbed(
      "Ping",
      "",
      [
        {
          name: "Latency",
          value: `${msg.createdTimestamp - message.createdTimestamp}ms`,
          inline: true
        },
        {
          name: "API Latency",
          value: `${Math.round(client.ws.ping)}ms`,
          inline: true
        }
      ]
    )
    message.channel.send(embed);
  }
}

export default Ping;