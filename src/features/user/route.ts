import { IncomingMessage, ServerResponse } from 'http';
import { EnumHttpMethod } from '../../../config/enums';
import { methodNotAllowedHandler } from '../../utils/http';
import UserController from './controllers';

const userController = new UserController();

const userRoute = (req: IncomingMessage, res: ServerResponse) => {
  switch (req.method) {
    case EnumHttpMethod.GET:
      userController.get(req, res);
      break;

    case EnumHttpMethod.DELETE:
      userController.delete(req, res);
      break;

    default:
      methodNotAllowedHandler(req, res);
  }
}

export default userRoute;