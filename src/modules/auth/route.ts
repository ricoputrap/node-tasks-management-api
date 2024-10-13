import { IncomingMessage, ServerResponse } from 'http';
import { EnumHttpMethod } from '../../../config/enums';
import { notFoundHandler } from '../../utils/http';
import AuthController from './controller';

enum EnumPaths {
  REGISTER = 'register',
  LOGIN = 'login',
  LOGOUT = 'logout',
  REFRESH = 'refresh'
}

const authController = new AuthController();

const authRoute = (req: IncomingMessage, res: ServerResponse) => {
  if (req.method === EnumHttpMethod.POST) {
    const path = req.url?.split('/').pop();

    switch (path) {
      case EnumPaths.REGISTER:
        authController.register(req, res);
        break;
      case EnumPaths.LOGIN:
        break;
      case EnumPaths.REFRESH:
        break;
      case EnumPaths.LOGOUT:
        break;
      default:
        notFoundHandler(req, res);
    }
  }
  else {
    notFoundHandler(req, res);
  }
}

export default authRoute;