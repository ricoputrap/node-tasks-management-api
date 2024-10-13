import { ServerResponse } from "http";
import IUser from "../../../entity/user.entity";
import { IUserLoginData, IUserRegistrationData } from "../schemas";
import { IncomingMessage } from "http";
import { IOperationResult } from "../../types";

export interface ICreateUserResult extends IOperationResult<Omit<IUser, "password" | "active">> { }
export interface ILoginUserResult extends IOperationResult<{ accessToken: string }> { }
export interface ILogoutUserResult extends IOperationResult<undefined> {}
export interface IRefreshTokenResult extends IOperationResult<{ accessToken: string }> { }

export interface IAuthService {
  register(userData: IUserRegistrationData): Promise<ICreateUserResult>;
  login(userData: IUserLoginData, res: ServerResponse): Promise<ILoginUserResult>;
  logout(req: IncomingMessage, res: ServerResponse): Promise<ILogoutUserResult>;
  refresh(req: IncomingMessage, res: ServerResponse): Promise<IRefreshTokenResult>;
}
