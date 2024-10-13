import { IncomingMessage, ServerResponse } from 'http';
import { IRefreshTokenResult } from './index.types';
import { EnumHttpStatus, EnumLogLevel } from '../../../../config/enums';
import log from '../../../utils/logger';
import { blacklistedRefreshTokens } from '../../../stores/tokens';
import { generateAccessToken, verifyRefreshToken } from '../../../token';
import { IPayload } from '../../../token/index.types';
import userModel from '../../../models/user';

const LOG_PREFIX = "[AuthService] refresh";

const refresh = async (req: IncomingMessage, res: ServerResponse) => {
  try {
    const result: IRefreshTokenResult = {
      success: false,
      status: EnumHttpStatus.UNAUTHORIZED
    };

    // read the refresh token from cookie httpOnly
    const cookies = req.headers.cookie;

    if (!cookies) {
      result.message = "Refresh token not found";

      log(EnumLogLevel.ERROR, `${LOG_PREFIX}: Authorization cookie is missing`);
      return result;
    }

    const refreshTokenCookie = cookies
      .split(';')
      .find((cookie) => cookie.trim().startsWith('refreshToken='));

    if (!refreshTokenCookie) {
      result.message = "Authorization cookie is missing";

      log(EnumLogLevel.ERROR, `${LOG_PREFIX}: Authorization cookie is missing`);
      return result;
    }

    const refreshToken = refreshTokenCookie
      .split('=')[1]
      .trim();

    // check if refresh token is blacklisted
    if (blacklistedRefreshTokens[refreshToken]) {
      result.message = "Refresh token is blacklisted";

      log(EnumLogLevel.ERROR, `${LOG_PREFIX}: Refresh token is blacklisted`);
      return result;
    }

    // verify the refresh token
    const refreshPayload = verifyRefreshToken(refreshToken) as IPayload;

    // invalid refresh token
    if (!refreshPayload) {
      result.message = "Invalid refresh token";

      log(EnumLogLevel.ERROR, `${LOG_PREFIX}: Invalid refresh token`);
      return result;
    }

    // get user from db
    const user= await userModel.getUserByEmail(refreshPayload.email);

    // user not found
    if (!user) {
      result.message = "User not found";

      log(EnumLogLevel.ERROR, `${LOG_PREFIX}: User not found`);
      return result;
    }

    // generate access
    const accessToken = generateAccessToken(user);

    result.success = true;
    result.status = EnumHttpStatus.OK;
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