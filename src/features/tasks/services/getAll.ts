import { EnumHttpStatus, EnumLogLevel } from "../../../../config/enums";
import taskModel from "../../../models/task";
import log from "../../../utils/logger";
import { IGetAllTasksResult } from "./index.types";

const LOG_PREFIX = '[TaskService] getAll';

const getAll = async (userID: number): Promise<IGetAllTasksResult> => {
  const tasks = await taskModel.getAllTasks(userID);

  log(EnumLogLevel.INFO, `${LOG_PREFIX}: Tasks retrieved successfully. Tasks: ${tasks.length}`);

  return {
    success: true,
    status: EnumHttpStatus.OK,
    message: 'Tasks retrieved successfully',
    data: tasks
  }
}

export default getAll;