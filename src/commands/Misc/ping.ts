import { Message } from "discord.js";
import ClientBot from "../../types/clientbot.types";
import { Command } from "../../types/command.types";

const Ping: Command = {
  conf: {
    guildOnly: false,
    permLevel: "User",
    enabledDefault: true,
  },
  help: {
    name: "Ping",
    category: "Misc",
    description: "The classic ping! Returns network and API latency",
    usage: "ping"
  },
  run: async function(client: ClientBot, message: Message) {
    const msg: Message = await message.reply("Ping?");
    msg.edit(`Pong! Latency is ${msg.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ws.ping)}ms`);
  }
}

export default Ping;