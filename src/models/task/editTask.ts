import db from "../../../config/database";
import { EnumLogLevel } from "../../../config/enums";
import ITask from "../../entity/task.entity";
import log from "../../utils/logger";
import { IEditTaskData } from "./index.types";

const LOG_PREFIX = '[TaskModel] editTask';

export const editTask = async (id: number, task: IEditTaskData): Promise<ITask> => {
  return new Promise((resolve, reject) => {
    try {
      const QUERY = `
        UPDATE TASK
        SET name = ?, status = ?
        WHERE id = ?
      `;

      const preparedQuery = db.prepare(QUERY);

      const { name, status, user_id } = task;
      preparedQuery.run(name, status, id);

      return resolve({
        id,
        name,
        status,
        user_id
      });
    }
    catch (error: any) {
      log(EnumLogLevel.ERROR, `${LOG_PREFIX}: ${error.message}`);
      reject(error);
    }
  });
}