import { Command } from "../../types/command.types";

const Ping: Command = {
  conf: {
    guildOnly: false,
    permLevel: "Owner",
    enabledDefault: true,
  },
  help: {
    name: "Ping",
    category: "Admin",
    description: "The classic ping! Returns network and API latency",
    usage: "ping"
  },
  run: async function(client, message, args) {
    if (!args[0]) return message.reply("Incorrect mode option! Use either MAINTENANCE or ACTIVE");

    switch (args[0]) {
      case "MAINTENANCE":
        if (client.mode === "MAINTENANCE") return message.reply("Client already in this mode");
        client.mode = "MAINTENANCE";
        message.reply("Client mode is now: MAINTENANCE");
        break;
    
      case "ACTIVE":
        if (client.mode === "ACTIVE") return message.reply("Client already in this mode");
        client.mode = "ACTIVE";
        message.reply("Client mode is now: ACTIVE");
        break;
      
      default:
        return message.reply("Incorrect mode option! Use either MAINTENANCE or ACTIVE");
    }
  }
}

export default Ping;