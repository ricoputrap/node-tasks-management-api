import db from "../../../config/database";
import IUser from "../../entity/user.entity";
import IUserModel, { INewUser, INewUserData } from "./index.types";

class UserModel implements IUserModel {

  async getUserByEmail(email: string): Promise<IUser | undefined> {
    const QUERY = `
      SELECT * FROM USER
      WHERE email = ?
    `;

    const preparedQuery = db.prepare(QUERY);
    const result = preparedQuery.get(email);

    return result as IUser;
  }

  async createUser(data: INewUserData): Promise<INewUser> {
    try {
      const QUERY = `
        INSERT INTO USER (name, email, password, role)
        VALUES (?, ?, ?, ?)
      `;
      const preparedQuery = db.prepare(QUERY);

      const { name, email, password, role } = data;

      const { lastInsertRowid } = preparedQuery.run(name, email, password, role);

      return {
        id: lastInsertRowid as number,
        name,
        email,
        role
      };
    }
    catch (error: any) {
      if (error.code === "ERR_SQLITE_ERROR") {
        
        // email already exists
        if (error.message.includes("UNIQUE constraint failed)")) {
          throw new Error("Email already exists");
        }
      }

      throw error;
    }
  }
}

export default UserModel;