import { EnumHttpStatus, EnumLogLevel } from "../../../../config/enums";
import userModel from "../../../models/user";
import log from "../../../utils/logger";
import { IDeleteUserResult } from "./index.types";

const LOG_PREFIX = '[UserService] delete';

const deleteOne = async (userID: number): Promise<IDeleteUserResult> => {
  await userModel.deleteUser(userID);
  log(EnumLogLevel.INFO, `${LOG_PREFIX}: User deleted successfully. User ID: ${userID}`);

  return {
    success: true,
    status: EnumHttpStatus.OK,
    message: 'User deleted successfully'
  };
}

export default deleteOne;