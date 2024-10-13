import { EnumHttpStatus, EnumLogLevel } from "../../../../config/enums";
import ITask from "../../../entity/task.entity";
import taskModel from "../../../models/task";
import log from "../../../utils/logger";
import { INewTaskSchema } from "../schemas";
import { ICreateTaskResult } from "./index.types";

const LOG_PREFIX = '[TaskService] create';

const create = async (userID: number, taskData: INewTaskSchema): Promise<ICreateTaskResult> => {
  const newTask: ITask = await taskModel.createTask({
    name: taskData.name,
    user_id: userID
  });

  log(EnumLogLevel.INFO, `${LOG_PREFIX}: Task created successfully. Task ID: ${newTask.id}`);

  return {
    success: true,
    status: EnumHttpStatus.CREATED,
    message: 'Task created successfully',
    data: newTask
  };
}

export default create;