import db from "../../../config/database";
import IUser from "../../entity/user.entity";
import IUserModel, { INewUser, INewUserData, ISafeUserData } from "./index.types";

class UserModel implements IUserModel {

  async getAll(): Promise<ISafeUserData[]> {
    const QUERY = `
      SELECT id, name, email, role, active
      FROM USER
    `;

    const preparedQuery = db.prepare(QUERY);
    const result = preparedQuery.all() as ISafeUserData[];

    return result;
  }

  async getUserById(userID: number): Promise<ISafeUserData | undefined> {
    const QUERY = `
      SELECT id, name, email, role, active
      FROM USER
      WHERE id = ?
    `;

    const preparedQuery = db.prepare(QUERY);
    const result = preparedQuery.get(userID) as ISafeUserData;

    return result;
  }

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

  async deleteUser(userID: number): Promise<void> {
    const QUERY = `
      DELETE FROM USER
      WHERE id = ?
    `;

    const preparedQuery = db.prepare(QUERY);
    preparedQuery.run(userID);

    return;
  }

  async archiveUser(userID: number): Promise<void> {
    const QUERY = `
      UPDATE USER
      SET active = 0
      WHERE id = ?
    `;

    const preparedQuery = db.prepare(QUERY);
    preparedQuery.run(userID);

    return;
  }
}

const userModel = new UserModel();

export default userModel;