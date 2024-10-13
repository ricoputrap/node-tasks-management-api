import { IUserRegistrationData } from "../schemas";
import { ICreateUserResult } from "./index.types";
import { EnumHttpStatus, EnumLogLevel } from "../../../../config/enums";
import log from "../../../utils/logger";
import { encrypt } from "../../../utils/passwordHashing";
import { INewUser } from "../../../models/user/index.types";
import userModel from "../../../models/user";
import ConflictError from "../../../errors/ConflictError";

const LOG_PREFIX = '[AuthService] register';

const register = async (userData: IUserRegistrationData): Promise<ICreateUserResult> => {
  const result: ICreateUserResult = {
    success: true,
    status: EnumHttpStatus.CREATED
  };

  // get the user to check if user already exists
  const existingUser = await userModel.getUserByEmail(userData.email);

  // user already exists
  if (existingUser) {
    const errorMessage = "Email already exists";
    log(EnumLogLevel.ERROR, `${LOG_PREFIX}: ${errorMessage} with email "${userData.email}"`);
    throw new ConflictError(errorMessage);
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

export default register;