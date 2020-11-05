import ClientBot from "../types/clientbot.types";

export default async function(client: ClientBot): Promise<void> {
  client.user?.setActivity(`In ${client.guilds.cache.size} Servers`, {
    type: "PLAYING",
  });
}