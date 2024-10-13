import { IncomingMessage, ServerResponse } from 'http';
import { EnumHttpStatus, EnumLogLevel } from '../../../../config/enums';
import log from '../../../utils/logger';
import { REFRESH_TOKEN_PATH } from '../../../../config/constants';
import { blacklistedAccessTokens, blacklistedRefreshTokens } from '../../../stores/tokens';
import { ILogoutUserResult } from './index.types';
import { verifyAccessToken, verifyRefreshToken } from '../../../token';
import { IPayload } from '../../../token/index.types';
import BadRequestError from '../../../errors/BadRequestError';
import UnauthorizedError from '../../../errors/UnauthorizedError';

const LOG_PREFIX = "[AuthService] logout";

const logout = async (req: IncomingMessage, res: ServerResponse) => {
  const authHeader = req.headers['authorization'];

  // auth header not found
  if (!authHeader) {
    const errorMessage = 'Authorization header not found';
    log(EnumLogLevel.ERROR, `${LOG_PREFIX}: ${errorMessage}`);
    throw new BadRequestError(errorMessage);
  }

  // extract token from auth header
  const token = authHeader.split(' ')[1];

  // token not found in auth header
  if (!token) {
    const errorMessage = 'Authorization token not found';
    log(EnumLogLevel.ERROR, `${LOG_PREFIX}: ${errorMessage}`);
    throw new BadRequestError(errorMessage);
  }

  // check if token is blacklisted
  if (blacklistedAccessTokens[token]) {
    const errorMessage = 'Access token is blacklisted already';
    log(EnumLogLevel.ERROR, `${LOG_PREFIX}: ${errorMessage}. Token: ${token}`);
    throw new UnauthorizedError(errorMessage);
  }

  // verify token
  const payload = verifyAccessToken(token) as IPayload;

  // invalid access token
  if (!payload) {
    const errorMessage = 'Invalid access token';
    log(EnumLogLevel.ERROR, `${LOG_PREFIX}: ${errorMessage}`);
    throw new UnauthorizedError(errorMessage);
  }

  // blacklist the access token
  blacklistedAccessTokens[token] = payload.exp;

  // log the blacklisted access token
  log(EnumLogLevel.ERROR, `${LOG_PREFIX}: Blacklisted access token. Token: ${token}`);

  // read the refresh token from cookie httpOnly
  const cookies = req.headers.cookie;

  if (!cookies) {
    const errorMessage = 'Authorization cookie is missing';
    log(EnumLogLevel.ERROR, `${LOG_PREFIX}: ${errorMessage}`);
    throw new BadRequestError(errorMessage);
  }

  const refreshTokenCookie = cookies
    .split(';')
    .find((cookie) => cookie.trim().startsWith('refreshToken='));

  if (!refreshTokenCookie) {
    const errorMessage = 'Refresh token is missing';
    log(EnumLogLevel.ERROR, `${LOG_PREFIX}: ${errorMessage}`);
    throw new BadRequestError(errorMessage);
  }

  const refreshToken = refreshTokenCookie
    .split('=')[1]
    .trim();

  // check if refresh token is blacklisted
  if (blacklistedRefreshTokens[refreshToken]) {
    const errorMessage = 'Refresh token is blacklisted already';
    log(EnumLogLevel.ERROR, `${LOG_PREFIX}: ${errorMessage}. Token: ${refreshToken}`);
    throw new UnauthorizedError(errorMessage);
  }

  // verify refresh token
  const refreshPayload = verifyRefreshToken(refreshToken) as IPayload;

  // invalid refresh token
  if (!refreshPayload) {
    const errorMessage = 'Invalid refresh token';
    log(EnumLogLevel.ERROR, `${LOG_PREFIX}: ${errorMessage}`);
    throw new UnauthorizedError(errorMessage);
  }

  // blacklist the refresh token
  blacklistedRefreshTokens[refreshToken] = refreshPayload.exp;

  // delete the refresh token from cookie
  res.setHeader('Set-Cookie', `refreshToken=; path=${REFRESH_TOKEN_PATH}; expires=Thu, 01 Jan 1970 00:00:00 GMT`);

  const result: ILogoutUserResult = {
    success: true,
    status: EnumHttpStatus.OK,
    message: 'Logout successful',
  };

  // log the success
  log(EnumLogLevel.INFO, `${LOG_PREFIX}: Logout successful for user id: ${payload.user_id}`);

  return result;
}

export default logout;