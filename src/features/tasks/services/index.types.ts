import ITask from "../../../entity/task.entity";
import { IOperationResult } from "../../types";
import { IEditTaskSchema, INewTaskSchema } from "../schemas";

export interface IGetAllTasksResult extends IOperationResult<ITask[]> {};
export interface IGetOneTaskResult extends IOperationResult<ITask> {};
export interface ICreateTaskResult extends IOperationResult<ITask> {};
export interface IEditTaskResult extends IOperationResult<ITask> {};
export interface IDeleteTaskResult extends IOperationResult<number> {};

interface ITaskService {
  getAll(userID: number): Promise<IGetAllTasksResult>;
  getById(taskID: number): Promise<IGetOneTaskResult>;
  create(userID: number, taskData: INewTaskSchema): Promise<ICreateTaskResult>;
  edit(id: number, userID: number, task: IEditTaskSchema): Promise<IEditTaskResult>;
  deleteOne(taskID: number, userID: number): Promise<IDeleteTaskResult>;
}

export default ITaskService;