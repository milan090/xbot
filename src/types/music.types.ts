import { TextChannel, VoiceChannel, VoiceConnection } from "discord.js";
import { Url } from "url";

export interface Song {
  title: string;
  url: Url;
}

export interface ServerQueue {
  textChannel: TextChannel;
  voiceChannel: VoiceChannel;
  connection: (VoiceConnection | null);
  songs: Song[];
  volume: number;
  playing: boolean;
}
