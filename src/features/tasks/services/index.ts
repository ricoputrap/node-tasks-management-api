import create from "./create";
import edit from "./edit";
import getAll from "./getAll";
import getById from "./getById";
import ITaskService from "./index.types";

const taskService: ITaskService = {
  getAll,
  getById,
  create,
  edit
}

export default taskService;