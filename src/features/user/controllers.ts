import { IncomingMessage, ServerResponse } from 'http';
import authorize from '../../decorators/authorize';
import { EnumUserRole } from '../../../config/enums';
import { errorHandler, sendResponse } from '../../utils/http';
import userService from './services';
import BadRequestError from '../../errors/BadRequestError';

const LOG_PREFIX = '[UserController]';

class UserController {

  @authorize([EnumUserRole.ADMIN])
  public get(req: IncomingMessage, res: ServerResponse) {
    const userID = Number(req.url?.split("/")[3]);

    if (userID) {
      this.getById(req, res, userID);
    }
    else {
      this.getAll(req, res);
    }
  }

  private async getAll(req: IncomingMessage, res: ServerResponse) {
    try {
      const result = await userService.getAll();

      sendResponse({
        res,
        status: result.status,
        success: result.success,
        message: result.message || 'Users retrieved successfully',
        data: result.data
      });
    }
    catch (error) {
      const logPrefix = `${LOG_PREFIX} getAll`;
      errorHandler(error, res, logPrefix);
    }
  }

  private async getById(req: IncomingMessage, res: ServerResponse, userID: number) {
    try {
      const result = await userService.getById(userID);

      sendResponse({
        res,
        status: result.status,
        success: result.success,
        message: result.message || 'User retrieved successfully',
        data: result.data
      });
    }
    catch (error) {
      const logPrefix = `${LOG_PREFIX} getById`;
      errorHandler(error, res, logPrefix);
    }
  }

  @authorize([EnumUserRole.ADMIN])
  public async delete(req: IncomingMessage, res: ServerResponse) {
    try {
      const userID = Number(req.url?.split('/')[3]);

      if (!userID) {
        const message = `The user ID is required.`;
        throw new BadRequestError(message);
      }

      const result = await userService.deleteOne(userID);

      sendResponse({
        res,
        status: result.status,
        success: result.success,
        message: result.message || 'User deleted successfully'
      });
    }
    catch (error) {
      const logPrefix = `${LOG_PREFIX} delete`;
      errorHandler(error, res, logPrefix);
    }
  }
}

export default UserController;