import { Command } from "../../types/command.types";

const Ping: Command = {
  conf: {
    guildOnly: false,
    permLevel: "User",
    enabledDefault: true,
  },
  help: {
    name: "Help",
    category: "Misc",
    description: "Help command displays all available commands and their usage",
    usage: "help",
  },
  run: async function (client, message, args: string[]) {
    const { enabledCommands } = message.settings;
    if (args[0]) {
      const searchCommand: string = args[0].toLowerCase();
      if (
        !message.settings.enabledCommands.includes(searchCommand) &&
        !client.commands.has(searchCommand)
      ) {
        return message.reply(
          "This command does not exist or is not enabled. Contact your server admin for further clarification"
        );
      } else {
        const commandHelp: Command["help"] = client.commands.get(searchCommand)
          ?.help as Command["help"];
        return message.channel.send(
          client.newMessageEmbed(
            commandHelp.name,
            `**Usage**: ${commandHelp.usage}\n **Description**: ${commandHelp.description}`
          )
        );
      }
    } else {
      const commands: Array<string> = enabledCommands
        .map((command) => {
          return client.commands.get(command)?.help.name;
        })
        .filter((e) => e !== undefined) as Array<string>;

      message.reply("Check your DMs, I have sent you all the info :)");
      message.author.send(
        client.newMessageEmbed(
          "Available Commands",
          commands.map((command) => `\`${command}\``).join(", "),
          [
            {
              name: "Usage",
              value: `Use \`${message.settings.prefix}help COMMAND\` to get details on a specific command. (replace COMMAND with any of the ones mentioned above)`,
            },
          ]
        )
      );
    }
  },
};

export default Ping;
