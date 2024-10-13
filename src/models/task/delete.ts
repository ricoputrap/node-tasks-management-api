import db from "../../../config/database";
import { EnumLogLevel } from "../../../config/enums";
import log from "../../utils/logger";

const LOG_PREFIX = '[TaskModel] deleteTask';

const deleteTask = async (taskID: number): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      const QUERY = `
        DELETE FROM TASK
        WHERE id = ?
      `;

      const preparedQuery = db.prepare(QUERY);
      preparedQuery.run(taskID);

      return resolve();
    }
    catch (error: any) {
      log(EnumLogLevel.ERROR, `${LOG_PREFIX}: ${error.message}`);
      reject(error);
    }
  });
}

export default deleteTask;