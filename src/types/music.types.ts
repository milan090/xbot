import { TextChannel, VoiceChannel, VoiceConnection } from "discord.js";

export interface ISong {
  title: string;
  url: string;
}

export interface IServerMusicQueue {
  textChannel: TextChannel;
  voiceChannel: VoiceChannel;
  connection: (VoiceConnection | null);
  songs: Array<ISong>;
  volume: number;
  playing: boolean;
}
