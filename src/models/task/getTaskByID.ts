import db from "../../../config/database";
import { EnumLogLevel } from "../../../config/enums";
import ITask from "../../entity/task.entity";
import log from "../../utils/logger";

const LOG_PREFIX = '[TaskModel] getTaskByID';

const getTaskByID = async (taskID: number): Promise<ITask | undefined> => {
  return new Promise((resolve, reject) => {
    try {
      const QUERY = `
      SELECT * FROM TASK
      WHERE id = ?
    `;

    const preparedQuery = db.prepare(QUERY);
    const result = preparedQuery.get(taskID) as ITask;

    return resolve(result);
    }
    catch (error: any) {
      log(EnumLogLevel.ERROR, `${LOG_PREFIX}: ${error.message}`);
      reject(error);
    }
  });
}

export default getTaskByID;