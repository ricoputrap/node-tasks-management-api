import db from "../../../config/database";
import { EnumLogLevel } from "../../../config/enums";
import ITask from "../../entity/task.entity";
import log from "../../utils/logger";

const LOG_PREFIX = '[TaskModel] getAllTasks';

const getAllTasks = async (userID: number): Promise<ITask[]> => {
  return new Promise((resolve, reject) => {
    try {
      const QUERY = `
        SELECT * FROM TASK
        WHERE user_id = ?
      `;

      const preparedQuery = db.prepare(QUERY);
      const result = preparedQuery.all(userID) as ITask[];

      return resolve(result);
    }
    catch (error: any) {
      log(EnumLogLevel.ERROR, `${LOG_PREFIX}: ${error.message}`);
      reject(error);
    }
  });
}

export default getAllTasks;