import { IncomingMessage, ServerResponse } from 'http';
import { errorHandler, sendResponse } from '../../utils/http';
import { validateData } from '../../utils/validations';
import { IUserLoginData, IUserRegistrationData, userLoginSchema, userRegistrationSchema } from './schemas';
import authService from './services';

const LOG_PREFIX = '[AuthController]';

class AuthController {

  public register(req: IncomingMessage, res: ServerResponse) {
    const logPrefix = `${LOG_PREFIX} register`;
    let body: string = '';

    req.on('data', (chunk) => {
      body += chunk;
    });

    req.on('end', async () => {
      try {
        const userData = validateData<IUserRegistrationData>(res, body, logPrefix, userRegistrationSchema);
        if (!userData) return;

        const result = await authService.register(userData);

        sendResponse({
          res,
          status: result.status,
          success: result.success,
          message: result.message || 'User created successfully',
        });
      }
      catch (error: any) {
        const logPrefix = `${LOG_PREFIX} register`;
        errorHandler(error, res, logPrefix);
      }
    });
  }

  public login(req: IncomingMessage, res: ServerResponse) {
    const logPrefix = `${LOG_PREFIX} login`;
    let body: string = '';

    req.on('data', (chunk) => {
      body += chunk;
    });

    req.on('end', async () => {
      try {
        const loginData = validateData<IUserLoginData>(res, body, logPrefix, userLoginSchema);
        if (!loginData) return;

        const result = await authService.login(loginData, res);

        sendResponse({
          res,
          status: result.status,
          success: result.success,
          message: result.message || 'Login successful',
          data: result.data
        });
      }
      catch (error: any) {
        const logPrefix = `${LOG_PREFIX} login`;
        errorHandler(error, res, logPrefix);
      }
    });
  }

  public async logout(req: IncomingMessage, res: ServerResponse) {
    try {
      const result = await authService.logout(req, res);
      sendResponse({
        res,
        status: result.status,
        success: result.success,
        message: result.message || 'Logout successful'
      });
    }
    catch (error: any) {
      const logPrefix = `${LOG_PREFIX} logout`;
      errorHandler(error, res, logPrefix);
    }
  }
}

export default AuthController;