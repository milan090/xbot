if (Number(process.version.slice(1).split(".")[0]) < 12) {
  throw new Error(
    "Node 12.0.0 or higher is required. Update Node on your system."
  );
}

import dotenv from "dotenv";
if (!process.env.DISCORD_API_KEY) {
  dotenv.config({ path: __dirname + "/.env" });
}

import ClientBot from "./types/clientbot.types";
import { promisify } from "util";
import { Command } from "./types/command.types";
import glob from "glob";
import { Intents } from "discord.js";

const globReaddir = promisify(glob); // Makes glob to return a promise

const client = new ClientBot({ ws: { intents: Intents.ALL } });

const init = async function () {
  // Load all commands from commands folder
  // Load ts files while testing, js in production after build
  const commandFiles: string[] = await globReaddir(`commands/**/*.${process.env.BUILD || "ts"}`, {
    cwd: __dirname,
  });
  const loadedCommands: string[] = [];
  const defaultEnabledCommands: string[] = [];

  await Promise.all(  // Each command loading will return a promise
    commandFiles.map(async (f) => {
      const groups = /(?<category>\w+)\/(?<commandName>\w+).(t|j)s$/.exec(f)
        ?.groups;
      if (!groups || !groups.commandName || !groups.category) return;
      const { commandName } = groups;
      if (commandName.startsWith("_")) return; // _filename.ts will be ignored

      client.logger.info(`Loading Command: ${commandName}`);
      try {
        const command: Command = (await import(`./${f}`)).default;
        client.commands.set(commandName, command);
        loadedCommands.push(commandName);
        if (command.conf.permLevel !== "Owner" && command.conf.enabledDefault) {
          defaultEnabledCommands.push(commandName);
        }
      } catch (error) {
        client.logger.info(
          `Loading command ${commandName} gave an error: ${error}`
        );
      }
    })
  );
  client.logger.info(`Loaded a total of ${loadedCommands.length} Commands`);

  // Load events from events folder
  const eventFiles: string[] = await globReaddir(`events/*.${process.env.BUILD || "ts"}`, {
    cwd: __dirname,
  });
  client.logger.info(`Loading a total of ${eventFiles.length} Events`);
  await Promise.all(
    eventFiles.map(async (f) => {
      const groups = /events\/(?<eventName>\w+).(t|j)s$/.exec(f)?.groups;
      if (!groups || !groups.eventName) return;
      const eventName = groups.eventName;
      try {
        const event = (await import(`./${f}`)).default;
        client.logger.info(`Loading Event: ${eventName}`);
        client.on(eventName, event.bind(null, client));
      } catch (error) {
        client.logger.info(
          `Loading event ${eventName} gave an error: ${error}`
        );
      }
    })
  );

  client.login(process.env.DISCORD_API_KEY);
};

init();
