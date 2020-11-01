import { model } from "mongoose";
import { IReactionRoleDocument, IReactionRoleModel } from "./reactionrole.types";
import ReactionRoleScheme from "./reactionrole.schema";

export const ReactionRoleModel: IReactionRoleModel = model<IReactionRoleDocument>("reactionroles", ReactionRoleScheme) as IReactionRoleModel;