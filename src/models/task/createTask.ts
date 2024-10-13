import db from "../../../config/database";
import { EnumLogLevel, EnumTaskStatus } from "../../../config/enums";
import ITask from "../../entity/task.entity";
import log from "../../utils/logger";
import { INewTaskData } from "./index.types";

const LOG_PREFIX = '[TaskModel] createTask';

const createTask = async (task: INewTaskData): Promise<ITask> => {
  return new Promise((resolve, reject) => {
    try {
      const QUERY = `
        INSERT INTO TASK (name, user_id)
        VALUES (?, ?)
      `;

      const preparedQuery = db.prepare(QUERY);

      const { name, user_id } = task;
      const { lastInsertRowid } = preparedQuery.run(name, user_id);

      return resolve({
        id: lastInsertRowid as number,
        name,
        status: EnumTaskStatus.TODO,
        user_id
      });
    }
    catch (error: any) {
      log(EnumLogLevel.ERROR, `${LOG_PREFIX}: ${error.message}`);
      reject(error);
    }
  });
}

export default createTask;