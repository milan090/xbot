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
      if (!message.settings.enabledCommands.includes(searchCommand) && !client.commands.has(searchCommand)) {
        return message.reply(
          "This command does not exist or is not enabled. Contact your server admin for further clarification"
        );
      } else {
        const commandHelp: Command["help"] = client.commands.get(searchCommand)?.help as Command["help"];
        return message.channel.send(
          client.newMessageEmbed(
            commandHelp.name,
            `**Usage**: ${commandHelp.name}\n **Description**: ${commandHelp.description}`
          )
        )
      }
      
    } else {
      const commandHelps: Array<Command["help"]> = enabledCommands.map(
        (enabledCommand) => {
          const cmd: Command | undefined = client.commands.get(enabledCommand);
          if (!cmd) return;
          return cmd.help;
        }
      ) as Array<Command["help"]>;
      
      message.author.send(
        client.newMessageEmbed(
          "Help",
          "",
          commandHelps.map(({ name, usage }) => ({
            name: `${message.settings.prefix}${name}`,
            value: usage,
          }))
        )
      );
    }
  },
};

export default Ping;
