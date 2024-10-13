import { EnumHttpStatus, EnumLogLevel } from "../../../../config/enums";
import NotFoundError from "../../../errors/NotFoundError";
import taskModel from "../../../models/task";
import log from "../../../utils/logger";
import { IGetOneTaskResult } from "./index.types";

const LOG_PREFIX = '[TaskService] getById';

const getById = async (taskID: number): Promise<IGetOneTaskResult> => {
  const task = await taskModel.getTaskByID(taskID);

  if (!task) {
    const message = `The task with ID ${taskID} does not exist.`;
    log(EnumLogLevel.ERROR, `${LOG_PREFIX}: ${message}`);
    throw new NotFoundError(message);
  }

  log(EnumLogLevel.INFO, `${LOG_PREFIX}: Task retrieved successfully. Task ID: ${taskID}`);

  return {
    success: true,
    status: EnumHttpStatus.OK,
    message: "Task retrieved successfully",
    data: task
  }
}

export default getById;