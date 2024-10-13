import create from "./create";
import getAll from "./getAll";
import getById from "./getById";
import ITaskService from "./index.types";

const taskService: ITaskService = {
  getAll,
  getById,
  create
}

export default taskService;