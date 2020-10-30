import { Message } from "discord.js";
import ClientBot from "../types/clientbot.types";
import { Command } from "../types/command.types";
import { OwnerIDs } from "../config.json";
import { IMessage } from "../types/imessage.types";


export default async function(client: ClientBot, message: Message): Promise<void> {
  if (message.author.bot) return; // Ignore bots
  if (!message.guild) return; // Remove to allow non-guild messages

  const msg: IMessage = message as IMessage;
  if (msg.guild?.id){  // If not a guild message
    msg.settings = await client.getOrCreateGuildSettings(msg.guild.id);
  } else {
    msg.settings = client.defaultSettings;
  }

  if (!msg.content.startsWith(msg.settings.prefix)) return; // Ignore non-command messages
  
  const args: string[] = msg.content.slice(msg.settings.prefix.length).trim().split(/ +/g);
  if (typeof args[0] !== "string") return;
  const commandName: string = args.shift()?.toLowerCase() as string;
  const isOwner: boolean = OwnerIDs.includes(msg.author.id);

  if (!commandName) return;
  if (!msg.settings.enabledCommands.includes(commandName) && !isOwner) return;
  if (client.mode === "MAINTENANCE" && !isOwner && commandName !== "setmode") {
    msg.reply("The bot is currently in MAINTENANCE mode. Sorry for the inconvenience."); return;
  }

  // Get the command
  const cmd: (Command | undefined) = client.commands.get(commandName);
  
  if (!cmd) {
    msg.reply("Command not found"); return;
  }
  
  if (cmd.conf.guildOnly && !msg.guild) {
    msg.reply("Command not found"); return; // If guild message sent to private
  }
  
  if (cmd.conf.permLevel === "Owner" && !isOwner) return; // check if Owner level command
  if (cmd.conf.permLevel === "Admin" && !msg.member?.hasPermission("ADMINISTRATOR")) return;

  // Run the command
  cmd.run(client, msg, args);
}