import { IncomingMessage, ServerResponse } from 'http';
import { errorHandler, sendResponse } from '../../utils/http';
import { validateData } from '../../utils/validations';
import AuthService, { IAuthService } from './services';
import { IUserRegistrationData, userRegistrationSchema } from './schemas';

const LOG_PREFIX = '[AuthController]';

class AuthController {
  private authService: IAuthService;

  constructor() {
    this.authService = new AuthService();
  }

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

        const result = await this.authService.register(userData);

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
}

export default AuthController;