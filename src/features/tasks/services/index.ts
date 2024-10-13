import create from "./create";
import getAll from "./getAll";
import ITaskService from "./index.types";

const taskService: ITaskService = {
  getAll,
  create
}

export default taskService;