import { IncomingMessage, ServerResponse } from 'http';
import { errorHandler, sendResponse } from '../../utils/http';
import { validateData } from '../../utils/validations';

const LOG_PREFIX = '[TasksController]';

class TasksController {

  public get(req: IncomingMessage, res: ServerResponse) {
    const taskID = Number(req.url?.split('/')[3]);

    if (taskID) {
      this.getById(req, res, taskID);
    }
    else {
      this.getAll(req, res);
    }
  }

  private getAll(req: IncomingMessage, res: ServerResponse) {

  }

  private getById(req: IncomingMessage, res: ServerResponse, taskID: number) {}

  public create(req: IncomingMessage, res: ServerResponse) {
    let body: string = '';

    req.on('data', (chunk) => {
      body += chunk;
    });

    req.on('end', () => {
      try {
        // const newTask = validateData(userRegistrationSchema, data);
      }
      catch (error) {
        errorHandler(error, res, LOG_PREFIX);
      }
    });
  }

  public update(req: IncomingMessage, res: ServerResponse) {}

  public delete(req: IncomingMessage, res: ServerResponse) {}
}

export default TasksController;