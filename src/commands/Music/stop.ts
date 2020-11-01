import { Guild } from "discord.js";
import { Command } from "../../types/command.types";

const Stop: Command = {
  conf: {
    guildOnly: true,
    permLevel: "User",
    enabledDefault: true,
  },
  help: {
    name: "stop",
    category: "Music",
    description: "Stops playing music, if it is playing one",
    usage: "stop"
  },
  run: async function(client, message) {
    const serverMusicQueues = client.serverMusicQueues.get((message.guild as Guild).id);
    if (!serverMusicQueues) {
      return message.reply("I'm not playing anything at the moment. Use play command to play a song");
    }
    serverMusicQueues.voiceChannel.leave()
    message.channel.send(
      "Ok that was fun. See you next time!"
    )
    client.serverMusicQueues.delete((message.guild as Guild).id);
  }
}

export default Stop;