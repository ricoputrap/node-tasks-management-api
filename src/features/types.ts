import { EnumHttpStatus } from "../../config/enums";

export interface IOperationResult<T> {
  success: boolean;
  status: EnumHttpStatus;
  data?: T;
  message?: string;
  errors?: Record<string, string>;
}