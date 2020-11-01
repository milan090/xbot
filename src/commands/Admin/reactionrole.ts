import { Guild, GuildMember, MessageEmbed, Role } from "discord.js";
import { ReactionRoleModel } from "../../models/reactionrole/reactionrole.model";
import { Command } from "../../types/command.types";

import { reactionRoleEmojies } from "./_reactionroleEmojies.json";

const regex = /".+?"/g;

const ReactionRole: Command = {
  conf: {
    guildOnly: true,
    permLevel: "Admin",
    enabledDefault: true,
  },
  
  help: {
    name: "reactionrole",
    category: "Admin",
    description: "This command will send a reaction role message to a specific channel",
    usage: "reactionrole \"roleid1\" \"roleid2\"......"
  },

  run: async function(client, message, args) {
    if (!args[0]) return message.reply("No arguments provided");
    if (!message.guild?.me?.hasPermission("MANAGE_ROLES")) {
      return message.reply("I dont have permission to assign roles");
    }

    const msgBody: string = args.join(" ");
    const regexResult = msgBody.matchAll(regex);

    if (regexResult) {
      const roleIds: Array<string> = [...regexResult]
        .map((match) => match[0])
        .map((e) => e.slice(1, e.length - 1));
      
      const myHighestRolePos: number = ((message.guild as Guild).me as GuildMember).roles.highest.rawPosition;
      const roles: Array<Role> = [];
      let flag = false;
      roleIds.forEach(roleId => {
        const role = (message.guild as Guild).roles.cache.get(roleId);
        if (!role) {
          flag = true;
          return;
        }
        if (myHighestRolePos < role.rawPosition) {
          flag = true;
          return message.reply(
            `I cannot assign role ${role.name} to someone else as my role is below them. Rearrange the roles to make this possible`
            )
        }
        roles.push(role);
      })

      if (flag) {
        return message.reply(
          "One of the roles are missing Or something else bad has happened which you can see above. Make sure the ids are correct"
        )
      }

      const embed: MessageEmbed = client.newMessageEmbed(
        "React to get a Role",
        roles.map((role, i) => `${reactionRoleEmojies[i]} ${role.name}`).join("\n")
      )

      const msg = await message.channel.send(embed);
      const emojies = reactionRoleEmojies.slice(0, roles.length);
      
      const emojieRoleIds: {[key: string]: string} = {};
      emojies.forEach((emojie, i) => emojieRoleIds[emojie] = roleIds[i])
      
      try {
        await ReactionRoleModel.create({
          guildId: message.guild.id,
          channelId: message.channel.id,
          messageId: msg.id,
          emojiRoleIds: emojieRoleIds
        })
        for (const emojie of emojies) {
          await msg.react(emojie);
        }

      } catch (error) {
        client.logger.error(error);
        message.reply("Oops something went wrong");
      }

    } else {
      message.reply("Invalid format. Check the correct format with the help command");
    }
  }
}

export default ReactionRole;