import ITask from "../../entity/task.entity";
import { IEditTaskSchema } from "../../features/tasks/schemas";

export type INewTaskData = Omit<ITask, "id" | "status">;

interface ITaskModel {
  getAllTasks(userID: number): Promise<ITask[]>;
  getTaskByID(taskID: number): Promise<ITask | undefined>;
  createTask(task: INewTaskData): Promise<ITask>;
  editTask(id: number, task: IEditTaskSchema): Promise<IEditTaskSchema>;
  deleteTask(taskID: number): Promise<number>;
}

export default ITaskModel;