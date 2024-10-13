import create from "./create";
import deleteOne from "./deleteOne";
import edit from "./edit";
import getAll from "./getAll";
import getById from "./getById";
import ITaskService from "./index.types";

const taskService: ITaskService = {
  getAll,
  getById,
  create,
  edit,
  deleteOne
}

export default taskService;