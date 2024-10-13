import { IncomingMessage, ServerResponse } from 'http';
import { IRefreshTokenResult } from './index.types';
import { EnumHttpStatus, EnumLogLevel } from '../../../../config/enums';
import log from '../../../utils/logger';
import { blacklistedRefreshTokens } from '../../../stores/tokens';
import { generateAccessToken, verifyRefreshToken } from '../../../token';
import { IPayload } from '../../../token/index.types';
import userModel from '../../../models/user';
import BadRequestError from '../../../errors/BadRequestError';
import UnauthorizedError from '../../../errors/UnauthorizedError';
import NotFoundError from '../../../errors/NotFoundError';

const LOG_PREFIX = "[AuthService] refresh";

const refresh = async (req: IncomingMessage, res: ServerResponse) => {
  const result: IRefreshTokenResult = {
    success: true,
    status: EnumHttpStatus.OK
  };

  // read the refresh token from cookie httpOnly
  const cookies = req.headers.cookie;

  if (!cookies) {
    const errorMessage = "Authorization cookie is missing";
    log(EnumLogLevel.ERROR, `${LOG_PREFIX}: ${errorMessage}`);
    throw new BadRequestError(errorMessage);
  }

  const refreshTokenCookie = cookies
    .split(';')
    .find((cookie) => cookie.trim().startsWith('refreshToken='));

  if (!refreshTokenCookie) {
    const errorMessage = "Refresh token is missing";
    log(EnumLogLevel.ERROR, `${LOG_PREFIX}: ${errorMessage}`);
    throw new BadRequestError(errorMessage);
  }

  const refreshToken = refreshTokenCookie
    .split('=')[1]
    .trim();

  // check if refresh token is blacklisted
  if (blacklistedRefreshTokens[refreshToken]) {
    const errorMessage = "Refresh token has been blacklisted";
    log(EnumLogLevel.ERROR, `${LOG_PREFIX}: ${errorMessage}`)
    throw new UnauthorizedError(errorMessage);
  }

  // verify the refresh token
  const refreshPayload = verifyRefreshToken(refreshToken) as IPayload;

  // invalid refresh token
  if (!refreshPayload) {
    const errorMessage = "Invalid refresh token";
    log(EnumLogLevel.ERROR, `${LOG_PREFIX}: ${errorMessage}`)
    throw new UnauthorizedError(errorMessage);
  }

  // get user from db
  const user = await userModel.getUserByEmail(refreshPayload.email);

  // user not found
  if (!user) {
    const errorMessage = `User does not exist with email "${refreshPayload.email}"`
    log(EnumLogLevel.ERROR, `${LOG_PREFIX}: ${errorMessage}`)
    throw new NotFoundError("User not found");
  }

  // generate access
  const accessToken = generateAccessToken(user);

  result.message = "Access token refreshed successfully";
  result.data = { accessToken }

  log(EnumLogLevel.INFO, `${LOG_PREFIX}: Access token refreshed successfully for email "${user.email}"`);

  return result;
}

export default refresh;