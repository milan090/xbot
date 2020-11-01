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
    name: "queue",
    category: "Music",
    description: "Lists down all the songs in the current queue",
    usage: "queue"
  },
  run: async function(client, message) {
    const serverMusicQueue: IServerMusicQueue | undefined = client.serverMusicQueues.get((message.guild as Guild).id);
    if (!serverMusicQueue) {
      return message.reply("Sorry but Im not playing anything now");
    }
    
    const songTitles: Array<string> = serverMusicQueue.songs.map(song => song.title);

    message.channel.send(
      `Queue \`\`\`js\n${songTitles.map((title, i) => `${i+1} ${title}`).join("\n")}\n\`\`\``
    )
  }
}

export default Skip;