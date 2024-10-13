import { IncomingMessage, ServerResponse } from 'http';
import { errorHandler, sendResponse } from '../../utils/http';
import { validateData } from '../../utils/validations';
import authorize from '../../decorators/authorize';
import { EnumUserRole } from '../../../config/enums';
import { INewTaskData, newTaskSchema } from './schemas';
import taskService from './services';
import ForbiddenError from '../../errors/ForbiddenError';
import { IUserData } from '../../token/index.types';

const LOG_PREFIX = '[TaskController]';

class TaskController {

  @authorize([EnumUserRole.USER])
  public get(req: IncomingMessage, res: ServerResponse) {
    const taskID = Number(req.url?.split('/')[3]);

    if (taskID) {
      this.getById(req, res, taskID);
    }
    else {
      this.getAll(req, res);
    }
  }

  private async getAll(req: IncomingMessage, res: ServerResponse) {
    try {
      if (!req.user) {
        const message = `The user is not allowed to access this resource.`;
        throw new ForbiddenError(message);
      }

      const userID = (req.user as IUserData).user_id;
      const result = await taskService.getAll(userID);

      sendResponse({
        res,
        status: result.status,
        success: result.success,
        message: result.message || 'Tasks retrieved successfully',
        data: result.data
      });
    }
    catch (error: any) {
      const logPrefix = `${LOG_PREFIX} getAll`;
      errorHandler(error, res, logPrefix);
    }
  }

  private getById(req: IncomingMessage, res: ServerResponse, taskID: number) {}

  @authorize([EnumUserRole.USER])
  public create(req: IncomingMessage, res: ServerResponse) {
    const logPrefix = `${LOG_PREFIX} create`;
    let body: string = '';

    req.on('data', (chunk) => {
      body += chunk;
    });

    req.on('end', async () => {
      try {
        if (!req.user) {
          const message = `The user is not allowed to access this resource.`;
          throw new ForbiddenError(message);
        }

        const newTask = validateData<INewTaskData>(res, body, logPrefix, newTaskSchema);
        if (!newTask) return;

        const result = await taskService.create({
          name: newTask.name,
          user_id: (req.user as IUserData).user_id
        });

        sendResponse({
          res,
          status: result.status,
          success: result.success,
          message: result.message || 'Task created successfully',
          data: result.data
        });
      }
      catch (error) {
        const logPrefix = `${LOG_PREFIX} register`;
        errorHandler(error, res, logPrefix);
      }
    });
  }

  @authorize([EnumUserRole.USER])
  public edit(req: IncomingMessage, res: ServerResponse) {}

  @authorize([EnumUserRole.USER])
  public delete(req: IncomingMessage, res: ServerResponse) {}
}

export default TaskController;