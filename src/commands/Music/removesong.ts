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
    name: "removesong",
    category: "Music",
    description: "Removes song at a specified index. Use `queue` command to check index",
    usage: "removesong <SONG_INDEX>"
  },
  run: async function(client, message, args) {
    const serverMusicQueue: IServerMusicQueue | undefined = client.serverMusicQueues.get((message.guild as Guild).id);
    if (!serverMusicQueue) {
      return message.reply("Sorry but Im not playing anything now");
    }
    
    const index = parseInt(args[0]);

    if (!index || serverMusicQueue.songs.length < index -1) {
      return message.reply("Incorrect song index provided");
    }

    if (index === 0) {
      return message.reply("Use skip to remove the first song");
    }

    message.channel.send(
      `**${serverMusicQueue.songs[index-1].title}** has been removed from the queue`
    )
    serverMusicQueue.songs.splice(index-1, 1);
  }
}

export default Skip;