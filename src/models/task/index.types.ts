import ITask from "../../entity/task.entity";

export type INewTaskData = Omit<ITask, "id" | "status">;
export type IEditTaskData = Omit<ITask, "id">;

interface ITaskModel {
  getAllTasks(userID: number): Promise<ITask[]>;
  getTaskByID(taskID: number): Promise<ITask | undefined>;
  createTask(task: INewTaskData): Promise<ITask>;
  editTask(id: number, task: IEditTaskData): Promise<ITask>;
  deleteTask(taskID: number): Promise<number>;
}

export default ITaskModel;