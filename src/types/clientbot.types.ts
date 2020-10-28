import { Client, ClientOptions, Message, MessageEmbed } from "discord.js";
import { Command } from "./command.types";
import winston from "winston";
import Logger from "../config/winston";
import { promisify } from "util";
import { ServerQueue } from "./music.types";
import { SettingsModel } from "../models/settings/settings.model";
import {
  ISettingsDocument,
  ISettings,
} from "../models/settings/settings.types";
import config, { defaultSettings } from "../config.json";
import { connect } from "../db";

export default class ClientBot extends Client {
  commands: Map<string, Command> = new Map();
  queues: Map<string, ServerQueue> = new Map();

  defaultSettings: ISettings = {
    guildId: "default",
    ...defaultSettings,
  };

  logger: winston.Logger = Logger;
  mode: "MAINTENANCE" | "ACTIVE" = "MAINTENANCE";
  wait = promisify(setTimeout);

  constructor(options?: ClientOptions | undefined) {
    super(options);
    connect();

    process.on("uncaughtException", (err: Error) => {
      // Replaces absolute file ardress with relative file address
      const errrorMsg: string = err.stack?.replace(
        new RegExp(`${__dirname}/`, "g"),
        "./"
      ) as string;
      this.logger.error(`Uncaught exception ${errrorMsg}`);
      console.error(err);

      process.exit(1);
    });

    process.on("unhandledRejection", (err: Error) => {
      this.logger.error(`Unhandled rejection: ${err}`);
      console.log(err);
    });
  }

  async getOrCreateGuildSettings(guildID: string): Promise<ISettings> {
    const settingsDoc: ISettingsDocument = await SettingsModel.findOneOrCreate(
      guildID
    );
    if (!settingsDoc) return this.defaultSettings;
    const settings: ISettings = {
      guildId: settingsDoc.guildId,
      prefix: settingsDoc.prefix,
      enabledCommands: settingsDoc.enabledCommands,
      welcomeEnabled: settingsDoc.welcomeEnabled,
      welcomeChannelId: settingsDoc.welcomeChannelId,
    };
    return settings;
  }

  createServerQueue(message: Message): ServerQueue | undefined {
    if (!message.member?.voice.channel) return;
    if (message.channel.type !== "text") return;
    return {
      textChannel: message.channel,
      voiceChannel: message.member?.voice.channel,
      connection: null,
      songs: [],
      volume: 5,
      playing: true,
    };
  }

  newMessageEmbed(
    title: string,
    content?: string | null,
    fields?: Array<{
      name: string;
      value: string;
      inline?: boolean;
    }>
  ): MessageEmbed {
    const embed: MessageEmbed = new MessageEmbed()
      .setColor(config.embedColor)
      .setAuthor(this.user?.username.toUpperCase())
      .setTitle(title)
      .setURL("https://github.com/milan090/xbot")
      .setDescription(content)

    if (fields) {
      embed.addFields(...fields);
    }

    embed
      .setTimestamp()
      .setFooter("Bot Author: Milan/milan090/codingdeck", "https://i.imgur.com/wSTFkRM.png");
    return embed;
  }
}
