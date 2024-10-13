import { IncomingMessage, ServerResponse } from 'http';
import { EnumHttpStatus, EnumLogLevel } from '../../../../config/enums';
import log from '../../../utils/logger';
import { REFRESH_TOKEN_PATH } from '../../../../config/constants';
import { blacklistedAccessTokens, blacklistedRefreshTokens } from '../../../stores/tokens';
import { ILogoutUserResult } from './index.types';
import { verifyAccessToken, verifyRefreshToken } from '../../../token';
import { IPayload } from '../../../token/index.types';

const LOG_PREFIX = "[AuthService] logout";

const logout = async (req: IncomingMessage, res: ServerResponse) => {
  try {
    const result: ILogoutUserResult = {
      success: true,
      status: EnumHttpStatus.OK
    };
    const authHeader = req.headers['authorization'];
  
    // auth header not found
    if (!authHeader) {
      result.success = false;
      result.status = EnumHttpStatus.UNAUTHORIZED;
      result.message = 'Authorization header not found';
  
      // log the error
      log(EnumLogLevel.ERROR, `${LOG_PREFIX}: Authorization header not found`);
  
      return result;
    }
  
    // extract token from auth header
    const token = authHeader.split(' ')[1];
  
    // token not found in auth header
    if (!token) {
      result.success = false;
      result.status = EnumHttpStatus.UNAUTHORIZED;
      result.message = 'Authorization token not found';
  
      // log the error
      log(EnumLogLevel.ERROR, `${LOG_PREFIX}: Authorization token not found`);
  
      return result;
    }
  
    // check if token is blacklisted
    if (blacklistedAccessTokens[token]) {
      result.success = false;
      result.status = EnumHttpStatus.UNAUTHORIZED;
      result.message = 'Access token is blacklisted already';
  
      // log the error
      log(EnumLogLevel.ERROR, `${LOG_PREFIX}: Access token is blacklisted already. Token: ${token}`);

      return result;
    }
  
    // verify token
    const payload = verifyAccessToken(token) as IPayload;
  
    // invalid access token
    if (!payload) {
      result.success = false;
      result.status = EnumHttpStatus.UNAUTHORIZED;
      result.message = 'Invalid access token';

      // log the error
      log(EnumLogLevel.ERROR, `${LOG_PREFIX}: Invalid access token. Token: ${token}`);
  
      return result;
    }
  
    // blacklist the access token
    blacklistedAccessTokens[token] = payload.exp;
  
    // log the blacklisted access token
    log(EnumLogLevel.ERROR, `${LOG_PREFIX}: Blacklisted access token. Token: ${token}`);
  
    // read the refresh token from cookie httpOnly
    const cookies = req.headers.cookie;
  
    if (!cookies) {
      result.success = false;
      result.status = EnumHttpStatus.UNAUTHORIZED;
      result.message = 'Authorization cookie is missing';

      // log the error
      log(EnumLogLevel.ERROR, `${LOG_PREFIX}: Authorization cookie is missing`);

      return result;
    }
  
    const refreshTokenCookie = cookies
      .split(';')
      .find((cookie) => cookie.trim().startsWith('refreshToken='));
  
    if (!refreshTokenCookie) {
      result.success = false;
      result.status = EnumHttpStatus.UNAUTHORIZED;
      result.message = 'Authorization cookie is missing';

      // log the error
      log(EnumLogLevel.ERROR, `${LOG_PREFIX}: Authorization cookie is missing`);

      return result;
    }
  
    const refreshToken = refreshTokenCookie
      .split('=')[1]
      .trim();
  
    // check if refresh token is blacklisted
    if (blacklistedRefreshTokens[refreshToken]) {
      result.success = false;
      result.status = EnumHttpStatus.UNAUTHORIZED;
      result.message = 'Refresh token is blacklisted already';

      // log the error
      log(EnumLogLevel.ERROR, `${LOG_PREFIX}: Refresh token is blacklisted already. Token: ${refreshToken}`);

      return result;
    }
  
    // verify refresh token
    const refreshPayload = verifyRefreshToken(refreshToken) as IPayload;
  
    // invalid refresh token
    if (!refreshPayload) {
      result.success = false;
      result.status = EnumHttpStatus.UNAUTHORIZED;
      result.message = 'Invalid refresh token';

      // log the error
      log(EnumLogLevel.ERROR, `${LOG_PREFIX}: Invalid refresh token. Token: ${refreshToken}`);

      return result;
    }

    // blacklist the refresh token
    blacklistedRefreshTokens[refreshToken] = refreshPayload.exp;

    // log the blacklisted refresh token
    log(EnumLogLevel.ERROR, `${LOG_PREFIX}: Blacklisted refresh token. Token: ${refreshToken}`);
  
    // delete the refresh token from cookie
    res.setHeader('Set-Cookie', `refreshToken=; path=${REFRESH_TOKEN_PATH}; expires=Thu, 01 Jan 1970 00:00:00 GMT`);

    result.message = 'Logout successful';
  
    // log the success
    log(EnumLogLevel.INFO, `${LOG_PREFIX}: Logout successful for user id: ${payload.user_id}`);

    return result;
  }
  catch (error: any) {
    log(EnumLogLevel.ERROR, `${LOG_PREFIX}: ${error.message}`);
    throw error;
  }
}

export default logout;