import { IAuthService } from "./index.types";
import login from "./login";
import logout from "./logout";
import refresh from "./refresh";
import register from "./register";

const authService: IAuthService = {
  register,
  login,
  logout,
  refresh
}

export default authService;