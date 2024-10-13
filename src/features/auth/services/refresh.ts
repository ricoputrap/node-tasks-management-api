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
  try {
    const result: IRefreshTokenResult = {
      success: true,
      status: EnumHttpStatus.OK
    };

    // read the refresh token from cookie httpOnly
    const cookies = req.headers.cookie;

    if (!cookies) {
      throw new BadRequestError("Authorization cookie is missing");
    }

    const refreshTokenCookie = cookies
      .split(';')
      .find((cookie) => cookie.trim().startsWith('refreshToken='));

    if (!refreshTokenCookie) {
      throw new BadRequestError("Refresh token is missing");
    }

    const refreshToken = refreshTokenCookie
      .split('=')[1]
      .trim();

    // check if refresh token is blacklisted
    if (blacklistedRefreshTokens[refreshToken]) {
      throw new UnauthorizedError("Refresh token has been blacklisted");
    }

    // verify the refresh token
    const refreshPayload = verifyRefreshToken(refreshToken) as IPayload;

    // invalid refresh token
    if (!refreshPayload) {
      throw new UnauthorizedError("Invalid refresh token");
    }

    // get user from db
    const user= await userModel.getUserByEmail(refreshPayload.email);

    // user not found
    if (!user) {
      throw new NotFoundError("User not found");
    }

    // generate access
    const accessToken = generateAccessToken(user);

    result.message = "Access token refreshed successfully";
    result.data = { accessToken }

    log(EnumLogLevel.INFO, `${LOG_PREFIX}: Access token refreshed successfully for email "${user.email}"`);

    return result;
  }
  catch (error: any) {
    log(EnumLogLevel.ERROR, `${LOG_PREFIX}: ${error.message}`);
    throw error;
  }
}

export default refresh;