import { EnumLogLevel } from "../../../config/enums";

export type LogFunction = (level: EnumLogLevel, message: string) => Promise<void>;