import { Guild, GuildMember, MessageEmbed } from "discord.js";
import { ReactionRoleModel } from "../../models/reactionrole/reactionrole.model";
import { Command } from "../../types/command.types";
import discordEmojiesIndex from "./_discordEmojis.json";

const discordEmojies: Array<string> = Object.values(discordEmojiesIndex);

const ReactionRole: Command = {
  conf: {
    guildOnly: true,
    permLevel: "Admin",
    enabledDefault: true,
  },

  help: {
    name: "reactionrole",
    category: "Misc",
    description: "This command will send a reaction role message to a specific channel",
    usage: "reactionrole emoji:roleid1 emoji:roleid2 ....",
  },

  run: async function (client, message, args) {
    if (!args[1]) return message.reply("No arguments provided");

    // Check if bot got perms to assign roles
    if (!message.guild?.me?.hasPermission("MANAGE_ROLES")) {
      return message.reply("I dont have permission to assign roles");
    }

    const emojiRoles: Array<{ emoji: string; roleId: string }> = [];

    const myHighestRolePos: number = ((message.guild as Guild)
      .me as GuildMember).roles.highest.rawPosition;

    for (const arg of args) {
      const emojiRole = arg.split(":");
      // Check: Emoji and guild name are given
      if (emojiRole.length !== 2) {
        return message.reply(
          "Invaid format. Use help command for this command's usage."
        );
      }

      // Check: Bot can use this emoji
      if (!client.emojis.cache.has(emojiRole[0]) && !discordEmojies.includes(emojiRole[0])) {
        return message.reply(`Invalid emoji used: ${emojiRole[0]}`);
      }

      const role = (message.guild as Guild).roles.cache.get(emojiRole[1]);

      if (!role) {
        return message.reply(`Could not find a role with id: ${emojiRole[1]}`);
      } else if (role.rawPosition > myHighestRolePos) {
        return message.reply(
          `I cannot assign role ${role.name} to someone else as my role is below them. Rearrange the roles to make this possible`
        );
      }

      emojiRoles.push({ emoji: emojiRole[0], roleId: emojiRole[1] });
    }
    const embed: MessageEmbed = client.newMessageEmbed(
      "React to get a Role",
      emojiRoles
        .map(({emoji, roleId}) => `${emoji}:   **${message.guild?.roles.cache.get(roleId)?.name}**`)
        .join("\n\n")
    );
    const msg = await message.channel.send(embed);

    const emojies: Array<string> = emojiRoles.map(({ emoji }) => emoji);
    const emojiRolesToUpload: { [key: string]: string } = {};

    // Using Objects for faster search
    emojiRoles.forEach(({ emoji, roleId }) => emojiRolesToUpload[emoji] = roleId);

    try {
      await ReactionRoleModel.create({
        guildId: message.guild.id,
        channelId: message.channel.id,
        messageId: msg.id,
        emojiRoleIds: emojiRolesToUpload,
      });

      for (const emojie of emojies) {
        await msg.react(emojie);
      }
    } catch (error) {
      client.logger.error(error);
      message.reply("Oops something went wrong");
    }
  },
};

export default ReactionRole;
