import { ServerResponse } from "http";
import { EnumHttpStatus } from "../../../../config/enums";
import IUser from "../../../entity/user.entity";
import { IUserLoginData, IUserRegistrationData } from "../schemas";

export interface IOperationResult<T> {
  success: boolean;
  status: EnumHttpStatus;
  data?: T;
  message?: string;
  errors?: Record<string, string>;
}

export interface ICreateUserResult extends IOperationResult<Omit<IUser, "password" | "active">> { }
export interface ILoginUserResult extends IOperationResult<{ accessToken: string }> { }

export interface IAuthService {
  register(userData: IUserRegistrationData): Promise<ICreateUserResult>;
  login(userData: IUserLoginData, res: ServerResponse): Promise<ILoginUserResult>;
}
