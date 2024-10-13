import ITask from "../../../entity/task.entity";
import { INewTaskData } from "../../../models/task/index.types";
import { IOperationResult } from "../../types";

export interface IGetAllTasksResult extends IOperationResult<ITask[]> {};
export interface ICreateTaskResult extends IOperationResult<ITask> {};

interface ITaskService {
  getAll(userID: number): Promise<IGetAllTasksResult>;
  // getById(taskID: number): Promise<ITask | undefined>;
  create(taskData: INewTaskData): Promise<ICreateTaskResult>;
  // edit(id: number, task: ITask): Promise<ITask>;
  // deleteOne(taskID: number): Promise<number>;
}

export default ITaskService;