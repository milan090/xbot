import { Guild, GuildMember, TextChannel } from "discord.js";
import { SettingsModel } from "../models/settings/settings.model";
import { ISettings } from "../models/settings/settings.types";
import ClientBot from "../types/clientbot.types";


export default async function(client: ClientBot, member:GuildMember): Promise<void> {
  console.log("AAAA");
  const guild: Guild = member.guild;
  client.logger.info(`${member.user.username} has joined the server`);
  try {
    const settings: ISettings = await SettingsModel.findOneOrCreate(guild.id);
    if (!settings.welcomeEnabled) return;
  
    const welcomeChannelId: (string | undefined) = settings.welcomeChannelId;
    if(!welcomeChannelId) return;
    if (guild.channels.cache.get(welcomeChannelId)?.type !== "text") return;
  
    const channel:TextChannel = guild.channels.cache.get(welcomeChannelId) as TextChannel;
    if (!channel) return;
    channel.send(`Welcome ${member.user} to this server.`).catch(console.error);
  } catch (error) {
    client.logger.error(error);
  }
}