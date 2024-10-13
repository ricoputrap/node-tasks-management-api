import { IncomingMessage, ServerResponse } from 'http';
import { EnumHttpMethod } from '../../../config/enums';
import { notFoundHandler } from '../../utils/http';
import TaskController from './controller';

const taskController = new TaskController();

const tasksRoute = (req: IncomingMessage, res: ServerResponse) => {
  switch (req.method) {
    case EnumHttpMethod.GET:
      taskController.get(req, res);
      break;

    case EnumHttpMethod.POST:
      taskController.create(req, res);
      break;

    case EnumHttpMethod.PUT:
      taskController.edit(req, res);
      break;

    case EnumHttpMethod.DELETE:
      taskController.delete(req, res);
      break;

    default:
      notFoundHandler(req, res);
  }
}

export default tasksRoute;