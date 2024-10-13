import createTask from "./createTask";
import deleteTask from "./delete";
import { editTask } from "./editTask";
import getAllTasks from "./getAllTasks";
import getTaskByID from "./getTaskByID";
import ITaskModel from "./index.types";

const taskModel: ITaskModel = {
  getAllTasks,
  getTaskByID,
  createTask,
  editTask,
  deleteTask
}

export default taskModel;