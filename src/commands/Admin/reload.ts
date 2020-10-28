import { Command } from "../../types/command.types";

const Ping: Command = {
  conf: {
    guildOnly: false,
    permLevel: "Owner",
    enabledDefault: true,
  },
  
  help: {
    name: "Reload",
    category: "Admin",
    description: "Used to reload commands without reloading bot",
    usage: "reload [command name]"
  },

  run: async function(client, message, args) {
    if (!args || args.length < 1) return message.reply("Must Provide A Command Name To Reload.");

    const commandName: string = args[0];
  
    if (!client.commands.has(commandName)) {
      return message.reply("That command does not exist.");
    }
    
    const commandCategory: string = client.commands.get(commandName)?.help.category as string;

    // Entering MAINTENANCE
    client.mode = "MAINTENANCE";

    try {
      delete require.cache[require.resolve(`../${commandCategory}/${commandName}.${process.env.BUILD || "ts"}`)];
      client.commands.delete(commandName);
    
      const props: Command = (await import(`../${commandCategory}/${commandName}.${process.env.BUILD || "ts"}`)).default;
      client.commands.set(commandName, props);
      message.reply(`The command ${commandName} has been reloaded`);
    } catch (error) {
      client.logger.error(`Error reloading Command: ${commandName}, Error: ${error}`);
    }
    // Exiting MAINTENANCE --> ACTIVE
    client.mode = "ACTIVE";
  }
}

export default Ping;