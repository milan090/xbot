import { GuildMember, MessageReaction, User } from "discord.js";
import { ReactionRoleModel } from "../models/reactionrole/reactionrole.model";
import { IReactionRoleDocument } from "../models/reactionrole/reactionrole.types";
import ClientBot from "../types/clientbot.types";


export default async function(client: ClientBot, reaction: MessageReaction, user: User): Promise<void> {
  if (!reaction.message.guild) return;
  const { guild } = reaction.message;
  const reactionRole: IReactionRoleDocument | null = await ReactionRoleModel.findOne({
    guildId: guild.id,
    messageId: reaction.message.id
  })
  
  if (!reactionRole) return;
  
  const {emojiRoleIds} = reactionRole;
  const roleId = emojiRoleIds.get(reaction.emoji.name);

  if (!roleId) return;

  const roleToAdd = guild.roles.cache.get(roleId);

  if (!roleToAdd) {
    client.logger.error(`The role with id ${roleId} doesnt exist in guild: ${guild.id}. Deleting reactionrole...`);
    ReactionRoleModel.deleteOne({ messageId: reactionRole.messageId });
    return;
  }

  try {
    const guildMember: GuildMember = await guild.members.fetch(user.id);
    guildMember.roles.add(roleToAdd);
  } catch (error) {
    client.logger.error(error);
  }

}