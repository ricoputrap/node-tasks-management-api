import { IncomingMessage, ServerResponse } from "http";
import { EnumLogLevel, EnumUserRole } from "../../config/enums";
import UnauthorizedError from "../errors/UnauthorizedError";
import { log } from "console";
import { blacklistedAccessTokens } from "../stores/tokens";
import { verifyAccessToken } from "../token";
import ForbiddenError from "../errors/ForbiddenError";
import { IPayload, IUserData } from "../token/index.types";
import { errorHandler } from "../http";

const LOG_PREFIX = "[DECORATORS] authorize";

/**
 * A decorator that verifies the access token in the Authorization header
 * and ensures that the user is allowed to access the decorated method.
 *
 * @param allowedRoles An array of EnumUserRole that is allowed to access the decorated method
 * @returns {function} A decorator function that takes in a target, property name, and property descriptor
 */
function authorize(allowedRoles: EnumUserRole[]) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      const req: IncomingMessage = args[0];
      const res: ServerResponse = args[1];

      try {
        const authHeader = req.headers['authorization'];

        // auth header not found
        if (!authHeader) {
          throw new UnauthorizedError('Authorization header not found');
        }

        // extract token from auth header
        const token = req.headers['authorization']?.split(' ')[1];

        // token not found in auth header
        if (!token) {
          // log the error
          const message = `${LOG_PREFIX}: Access token is blacklisted. Token: ${token}`;
          log(EnumLogLevel.ERROR, message);
          throw new UnauthorizedError('Authorization token not found');
        }

        // check if token is blacklisted
        if (blacklistedAccessTokens[token]) {
          throw new UnauthorizedError('Access token is blacklisted');
        }

        // verify & decode the access token
        const payload = verifyAccessToken(token) as IPayload;

        // invalid token
        if (!payload) {
          throw new UnauthorizedError('Invalid access token');
        }

        // forbidden to access
        if (!allowedRoles.includes(payload.role)) {
          const message = `The user '${payload.email}' is not allowed to access this resource.`;
          throw new ForbiddenError(message);
        }

        // construct user data that will be passed to the original method
        const user: IUserData = {
          user_id: payload.user_id,
          email: payload.email,
          role: payload.role
        }
        req.user = user;

        // Call the original method with user information
        return originalMethod.apply(this, [...args]);
      }

      catch (error: any) {
        const logPrefix = `${EnumLogLevel.ERROR} ${LOG_PREFIX}`;
        errorHandler(error, res, logPrefix);
      }
    };

    return descriptor;
  }
}

export default authorize