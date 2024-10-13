import { IUserRegistrationData } from "../schemas";
import { ICreateUserResult } from "./index.types";
import { EnumHttpStatus, EnumLogLevel } from "../../../../config/enums";
import log from "../../../utils/logger";
import { encrypt } from "../../../utils/passwordHashing";
import { INewUser } from "../../../models/user/index.types";
import userModel from "../../../models/user";

const LOG_PREFIX = '[AuthService]';

const register = async (userData: IUserRegistrationData): Promise<ICreateUserResult> => {
  try {
    const result: ICreateUserResult = {
      success: true,
      status: EnumHttpStatus.CREATED
    };

    // get the user to check if user already exists
    const existingUser = await userModel.getUserByEmail(userData.email);

    // user already exists
    if (existingUser) {
      result.message = "Email already exists";
      result.status = EnumHttpStatus.CONFLICT;

      log(EnumLogLevel.ERROR, `${LOG_PREFIX} register: User already exists with email "${userData.email}"`);
      return result;
    }

    // hash the password
    const hashedPassword = encrypt(userData.password);

    // create the user
    const newUser: INewUser = await userModel.createUser({
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
      role: userData.role
    });

    // prepare the response
    result.data = newUser;
    result.message = "User created successfully";

    const msg = `${LOG_PREFIX} register: User created successfully with email "${userData.email}" and id ${newUser.id}`;
    log(EnumLogLevel.INFO, msg);

    return result;
  }
  catch (error: any) {
    log(EnumLogLevel.ERROR, `${LOG_PREFIX} register: ${error.message}`);
    throw error;
  }
}

export default register;