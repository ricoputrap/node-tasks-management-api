import { EnumHttpStatus, EnumLogLevel } from "../../../../config/enums";
import ForbiddenError from "../../../errors/ForbiddenError";
import taskModel from "../../../models/task";
import log from "../../../utils/logger";
import { IEditTaskSchema } from "../schemas";
import { IEditTaskResult } from "./index.types";

const LOG_PREFIX = '[TaskService] edit';

const edit = async (id: number, userID: number, taskData: IEditTaskSchema): Promise<IEditTaskResult> => {
  const task = await taskModel.getTaskByID(id);

  // check if the task belongs to the user
  if (task?.user_id !== userID) {
    const message = `The user is not allowed to access this resource.`;
    throw new ForbiddenError(message);
  }

  const editedTask: IEditTaskSchema = await taskModel.editTask(id, taskData);
  log(EnumLogLevel.INFO, `${LOG_PREFIX}: Task edited successfully. Task ID: ${id}`);

  return {
    success: true,
    status: EnumHttpStatus.OK,
    message: 'Task edited successfully',
    data: {
      id,
      name: editedTask.name,
      status: editedTask.status,
      user_id: userID
    }
  };
}

export default edit;