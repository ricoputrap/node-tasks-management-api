import { EnumHttpStatus, EnumLogLevel } from "../../../../config/enums";
import ForbiddenError from "../../../errors/ForbiddenError";
import NotFoundError from "../../../errors/NotFoundError";
import taskModel from "../../../models/task";
import log from "../../../utils/logger";
import { IDeleteTaskResult } from "./index.types";

const LOG_PREFIX = '[TaskService] delete';

const deleteOne = async (id: number, userID: number): Promise<IDeleteTaskResult> => {
  const task = await taskModel.getTaskByID(id);

  // check if the task exists
  if (!task) {
    const message = `The task with ID ${id} does not exist.`;
    log(EnumLogLevel.ERROR, `${LOG_PREFIX}: ${message}`);
    throw new NotFoundError(message);
  }

  // check if the task belongs to the user
  if (task?.user_id !== userID) {
    const message = `The user is not allowed to access this task.`;
    throw new ForbiddenError(message);
  }

  // delete the task
  await taskModel.deleteTask(id);
  log(EnumLogLevel.INFO, `${LOG_PREFIX}: Task deleted successfully. Task ID: ${id}`);

  return {
    success: true,
    status: EnumHttpStatus.OK,
    message: 'Task deleted successfully'
  };
}

export default deleteOne;