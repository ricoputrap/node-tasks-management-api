import { IncomingMessage, ServerResponse } from 'http';
import { EnumHttpMethod } from '../../../config/enums';
import { notFoundHandler } from '../../utils/http';
import TasksController from './controller';

const tasksController = new TasksController();

const tasksRoute = (req: IncomingMessage, res: ServerResponse) => {
  switch (req.method) {
    case EnumHttpMethod.GET:
      tasksController.get(req, res);
      break;

    case EnumHttpMethod.POST:
      tasksController.create(req, res);
      break;

    case EnumHttpMethod.PUT:
      tasksController.update(req, res);
      break;

    case EnumHttpMethod.DELETE:
      tasksController.delete(req, res);
      break;

    default:
      notFoundHandler(req, res);
  }
}

export default tasksRoute;