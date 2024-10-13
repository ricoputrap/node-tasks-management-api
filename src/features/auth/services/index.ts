import { IAuthService } from "./index.types";
import login from "./login";
import logout from "./logout";
import register from "./register";

const authService: IAuthService = {
  register,
  login,
  logout
}

export default authService;