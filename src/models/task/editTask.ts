import db from "../../../config/database";
import { EnumLogLevel } from "../../../config/enums";
import { IEditTaskSchema } from "../../features/tasks/schemas";
import log from "../../utils/logger";

const LOG_PREFIX = '[TaskModel] editTask';

export const editTask = async (id: number, task: IEditTaskSchema): Promise<IEditTaskSchema> => {
  return new Promise((resolve, reject) => {
    try {
      const QUERY = `
        UPDATE TASK
        SET name = ?, status = ?
        WHERE id = ?
      `;

      const preparedQuery = db.prepare(QUERY);

      const { name, status } = task;
      preparedQuery.run(name, status, id);

      return resolve({
        name,
        status
      });
    }
    catch (error: any) {
      log(EnumLogLevel.ERROR, `${LOG_PREFIX}: ${error.message}`);
      reject(error);
    }
  });
}