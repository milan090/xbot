import {
  ClientUser,
  Guild,
  GuildMember,
  VoiceChannel,
  VoiceConnection,
} from "discord.js";
import { searchVideo } from "../../api/ytsearch";
import { Command } from "../../types/command.types";
import { IServerMusicQueue, ISong } from "../../types/music.types";

import ytdl from "ytdl-core-discord";
import logger from "../../config/winston";
import ClientBot from "../../types/clientbot.types";

const Play: Command = {
  conf: {
    guildOnly: true,
    permLevel: "User",
    enabledDefault: true,
  },
  help: {
    name: "play",
    category: "Music",
    description: "Play songs in your server with this awesome command.",
    usage: "music",
  },
  run: async function (client, message, args: string[]) {
    if (!args[0]) {
      return message.reply(
        "No search query provided. Refer to the help command for more"
      );
    }

    const voiceChannel: VoiceChannel  = (message.member as GuildMember).voice.channel as VoiceChannel;
    const permissions = voiceChannel.permissionsFor(
      message.client.user as ClientUser
    );

    if (!permissions?.has("CONNECT") || !permissions.has("SPEAK")) {
      return message.reply(
        "I need the permission to CONNECT and SPEAK in this Voice Channel. Contact your server's Admin"
      );
    }

    const song: ISong | undefined = await searchVideo(args.join(" "));
    if (!song) {
      return message.reply("We couldnt find such a song. Sorry :(");
    }

    let serverMusicQueue:
      | IServerMusicQueue
      | undefined = client.serverMusicQueues.get((message.guild as Guild).id);
    if (!serverMusicQueue) {
      serverMusicQueue = client.createServerQueue(message);
      
      if (!serverMusicQueue) {
        return message.channel.send(
          "Oops! Something went wrong"
        )
      }

      client.serverMusicQueues.set(
        (message.guild as Guild).id,
        serverMusicQueue
      );

      serverMusicQueue.songs.push(song);

      try {
        const connection: VoiceConnection = await voiceChannel.join();
        serverMusicQueue.connection = connection;
        playSong(client, serverMusicQueue, song);
      } catch (error) {
        logger.error(error);
        return client.serverMusicQueues.delete((message.guild as Guild).id);
      }
    } else {
      serverMusicQueue.songs.push(song);
      return message.channel.send(
        `**${song.title}** has been added to the queue`
      )
    }
  },
};

export default Play;

export async function playSong(
  client: ClientBot,
  serverMusicQueue: IServerMusicQueue,
  song: ISong 
): Promise<void> {
  if (!song) {
    serverMusicQueue.voiceChannel.leave();
    serverMusicQueue.textChannel.send(
      "Song queue is empty. Ill be leaving the voice then. Cya :)"
    )
    client.serverMusicQueues.delete(serverMusicQueue.textChannel.guild.id);
    return;
  }

  if (!serverMusicQueue.connection) {
    serverMusicQueue.textChannel.send("Something bad happened and I got disconnected :O");
    return;
  }

  let songStream;
  try {
    songStream = await ytdl(song.url);
  } catch (error) {
    serverMusicQueue.textChannel.send(
      "Oops something bad happened and we are unable to play this song"
    )
    client.logger.error(error);
    return;
  }
  const dispatcher = serverMusicQueue.connection
    .play(songStream, { type: "opus" })
    .on("finish", () => {
      serverMusicQueue.songs.shift();
      playSong(client, serverMusicQueue, serverMusicQueue.songs[0]);
    })
    .on("error", (error) => {
      client.serverMusicQueues.delete(serverMusicQueue.textChannel.guild.id);
      logger.error(error);
    });
  dispatcher.setVolumeLogarithmic(serverMusicQueue.volume / 5);
  serverMusicQueue.textChannel.send(`Started playing: **${song.title}**`);
}
