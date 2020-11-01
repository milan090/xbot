import { Guild } from "discord.js";
import { Command } from "../../types/command.types";
import { IServerMusicQueue } from "../../types/music.types";

const Skip: Command = {
  conf: {
    guildOnly: true,
    permLevel: "User",
    enabledDefault: true,
  },
  help: {
    name: "skip",
    category: "Music",
    description: "Skips the currently playing song",
    usage: "skip"
  },
  run: async function(client, message) {
    const serverMusicQueue: IServerMusicQueue | undefined = client.serverMusicQueues.get((message.guild as Guild).id);
    if (!serverMusicQueue) {
      return message.reply("Sorry but Im not playing anything now");
    }
    serverMusicQueue.connection?.dispatcher.end();
  }
}

export default Skip;