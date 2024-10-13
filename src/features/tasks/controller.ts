import { IncomingMessage, ServerResponse } from 'http';
import { errorHandler, sendResponse } from '../../utils/http';
import { validateData } from '../../utils/validations';
import authorize from '../../decorators/authorize';
import { EnumUserRole } from '../../../config/enums';
import { IEditTaskSchema, INewTaskSchema, editTaskSchema, newTaskSchema } from './schemas';
import taskService from './services';
import ForbiddenError from '../../errors/ForbiddenError';
import { IUserData } from '../../token/index.types';
import BadRequestError from '../../errors/BadRequestError';

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

  private async getById(req: IncomingMessage, res: ServerResponse, taskID: number) {
    try {
      if (!req.user) {
        const message = `The user is not allowed to access this resource.`;
        throw new ForbiddenError(message);
      }

      const userID = (req.user as IUserData).user_id;
      const result = await taskService.getById(taskID);

      // check if the task belongs to the user
      if (result.data?.user_id !== userID) {
        const message = `The user is not allowed to access this resource.`;
        throw new ForbiddenError(message);
      }

      sendResponse({
        res,
        status: result.status,
        success: result.success,
        message: result.message || 'Task retrieved successfully',
        data: result.data
      });
    }
    catch (error: any) {
      const logPrefix = `${LOG_PREFIX} getById`;
      errorHandler(error, res, logPrefix);
    }
  }

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

        const newTask = validateData<INewTaskSchema>(res, body, logPrefix, newTaskSchema);
        if (!newTask) return;

        const userID: number = (req.user as IUserData).user_id;
        const result = await taskService.create(userID, {
          name: newTask.name,
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
  public edit(req: IncomingMessage, res: ServerResponse) {
    const logPrefix = `${LOG_PREFIX} edit`;
    let body: string = '';

    const taskID: number = Number(req.url?.split('/')[3]);

    if (!taskID) {
      const message = `The task ID is required.`;
      throw new BadRequestError(message);
    }

    req.on('data', (chunk) => {
      body += chunk;
    });

    req.on('end', async () => {
      try {
        if (!req.user) {
          const message = `The user is not allowed to access this resource.`;
          throw new ForbiddenError(message);
        }

        const validatedTaskData = validateData<IEditTaskSchema>(res, body, logPrefix, editTaskSchema);
        if (!validatedTaskData) return;

        const userID = (req.user as IUserData).user_id;
        const result = await taskService.edit(taskID, userID, validatedTaskData);

        sendResponse({
          res,
          status: result.status,
          success: result.success,
          message: result.message || 'Task edited successfully',
          data: result.data
        });
      }
      catch (error) {
        const logPrefix = `${LOG_PREFIX} edit`;
        errorHandler(error, res, logPrefix);
      }
    });
  }

  @authorize([EnumUserRole.USER])
  public delete(req: IncomingMessage, res: ServerResponse) {}
}

export default TaskController;