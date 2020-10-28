import ClientBot from "./clientbot.types";
import { IMessage } from "./imessage.types";

export interface CommandConf {
  guildOnly: boolean;
  permLevel: ("User" | "Admin" | "Owner");
  enabledDefault: boolean;
  aliases?: string[];
}

export interface CommandHelp {
  name: string;
  category: string;
  description: string;
  usage: string;
}

export interface CommandRunFunc {
  (client: ClientBot, message: IMessage, args: string[]): void;
}

export interface Command {
  conf: CommandConf;
  help: CommandHelp;
  run: CommandRunFunc;
}