import { IAuthService } from "./index.types";
import login from "./login";
import register from "./register";

const authService: IAuthService = {
  register,
  login,
}

export default authService;