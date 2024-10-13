import archiveOne from "./archiveOne";
import deleteOne from "./deleteOne";
import getAll from "./getAll";
import getById from "./getById";
import IUserService from "./index.types";

const userService: IUserService = {
  getAll,
  getById,
  deleteOne,
  archiveOne
}

export default userService;