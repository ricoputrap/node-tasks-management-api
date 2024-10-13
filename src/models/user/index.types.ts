import IUser from "../../entity/user.entity";

export type INewUserData = Omit<IUser, "id" | "active">;
export type INewUser = Omit<IUser, "password" | "active">;

interface IUserModel {
  getUserByEmail(email: string): Promise<IUser | undefined>;
  createUser(user: INewUserData): Promise<INewUser>;
}

export default IUserModel;