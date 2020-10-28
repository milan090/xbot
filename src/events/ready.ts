import ClientBot from "../types/clientbot.types";

export default function (client: ClientBot): void {
  // Log that the bot is online.
  const guildCount: number = client.guilds.cache.size;
  const userCount: number = client.guilds.cache.reduce((a, g) => a + g.memberCount, 0);
  
  client.logger.info(
    `${client.user?.username}, ready to serve ${userCount} users in ${guildCount} servers.`,
    "ready"
  );

  client.user?.setActivity(`In ${client.guilds.cache.size} Servers`, {
    type: "PLAYING",
  });

  client.mode = "ACTIVE";
}
