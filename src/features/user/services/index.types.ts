import { ISafeUserData } from "../../../models/user/index.types";
import { IOperationResult } from "../../types";

export interface IGetAllUsersResult extends IOperationResult<ISafeUserData[]> {};
export interface IGetOneUserResult extends IOperationResult<ISafeUserData> {};
export interface IDeleteUserResult extends IOperationResult<undefined> {};

interface IUserService {
  getAll(): Promise<IGetAllUsersResult>;
  getById(userID: number): Promise<IGetOneUserResult>;
  deleteOne(userID: number): Promise<IDeleteUserResult>;
  archiveOne(userID: number): Promise<IDeleteUserResult>;
}

export default IUserService;