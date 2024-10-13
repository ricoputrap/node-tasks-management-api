import IUser from "../../entity/user.entity";

export type ISafeUserData = Omit<IUser, "password">;
export type INewUserData = Omit<IUser, "id" | "active">;
export type INewUser = Omit<IUser, "password" | "active">;

interface IUserModel {
  getAll(): Promise<ISafeUserData[]>;
  getUserById(userID: number): Promise<ISafeUserData | undefined>;
  getUserByEmail(email: string): Promise<IUser | undefined>;
  createUser(user: INewUserData): Promise<INewUser>;
  deleteUser(userID: number): Promise<void>;
}

export default IUserModel;