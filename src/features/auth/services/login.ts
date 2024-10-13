import { ServerResponse } from "http";
import { IUserLoginData } from "../schemas";
import { ILoginUserResult } from "./index.types";
import { EnumHttpStatus, EnumLogLevel } from "../../../../config/enums";
import log from "../../../utils/logger";
import { encrypt } from "../../../utils/passwordHashing";
import { generateAccessToken, generateRefreshToken, setHttpOnlyCookie } from "../../../token";
import { ONE_DAY_IN_SECONDS, REFRESH_TOKEN_PATH } from "../../../../config/constants";
import userModel from "../../../models/user";
import NotFoundError from "../../../errors/NotFoundError";
import UnauthorizedError from "../../../errors/UnauthorizedError";

const LOG_PREFIX = '[AuthService]';

const login = async (userData: IUserLoginData, res: ServerResponse): Promise<ILoginUserResult> => {
  const result: ILoginUserResult = {
    success: true,
    status: EnumHttpStatus.OK
  };

  // get the user to check if user already exists
  const existingUser = await userModel.getUserByEmail(userData.email);

  // user does not exist
  if (!existingUser) {
    const errorMessage = `User does not exist with email "${userData.email}"`;
    log(EnumLogLevel.ERROR, `${LOG_PREFIX} login: ${errorMessage}`);
    throw new NotFoundError("User does not exist");
  }

  // hash the password
  const hashedPassword = encrypt(userData.password);

  // compare the password
  if (hashedPassword !== existingUser.password) {
    const errorMessage = `Incorrect password for email "${userData.email}"`;
    log(EnumLogLevel.ERROR, `${LOG_PREFIX} login: ${errorMessage}`);
    throw new UnauthorizedError("Incorrect password");
  }

  // generate access and refresh tokens
  const accessToken = generateAccessToken(existingUser);
  const refreshToken = generateRefreshToken(existingUser);

  // set the refresh token as an HTTP-only cookie
  const maxAge = ONE_DAY_IN_SECONDS * 30;
  setHttpOnlyCookie(res, "refreshToken", refreshToken, {
    maxAge,
    path: REFRESH_TOKEN_PATH
  });

  // prepare the response
  result.data = { accessToken };
  result.message = "User logged in successfully";

  return result;
}

export default login;