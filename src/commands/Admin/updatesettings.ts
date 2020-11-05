import { Command } from "../../types/command.types";

const Ping: Command = {
  conf: {
    guildOnly: false,
    permLevel: "Owner",
    enabledDefault: true,
  },
  
  help: {
    name: "updatesettings",
    category: "Admin",
    description: "Updates the settings to enable all new commands",
    usage: "updatesettings"
  },

  run: async function(client) {
    client.mode = "MAINTENANCE";
    try {
      delete require.cache[require.resolve("../../config.json")];
      const newDefaultSettings = (await import("../../config.json")).defaultSettings;
      client.defaultSettings = {
        ...client.defaultSettings,
        ...newDefaultSettings,
      }
    } catch (error) {
      client.logger.error(error);
      client.mode = "ACTIVE";
    }
    client.mode = "ACTIVE";
  }
}

export default Ping;