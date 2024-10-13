import { EnumHttpStatus, EnumLogLevel } from "../../../../config/enums";
import ITask from "../../../entity/task.entity";
import taskModel from "../../../models/task";
import { INewTaskData } from "../../../models/task/index.types";
import log from "../../../utils/logger";
import { ICreateTaskResult } from "./index.types";

const LOG_PREFIX = '[TaskService] create';

const create = async (taskData: INewTaskData): Promise<ICreateTaskResult> => {
  const newTask: ITask = await taskModel.createTask(taskData);

  log(EnumLogLevel.INFO, `${LOG_PREFIX}: Task created successfully. Task ID: ${newTask.id}`);

  return {
    success: true,
    status: EnumHttpStatus.CREATED,
    message: 'Task created successfully',
    data: newTask
  };
}

export default create;