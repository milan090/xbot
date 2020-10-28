import { model } from "mongoose";
import { ISettingsDocument, ISettingsModel } from "./settings.types";
import SettingsSchema from "./settings.schema";

export const SettingsModel: ISettingsModel = model<ISettingsDocument>("settings", SettingsSchema) as ISettingsModel;