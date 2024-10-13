import { EnumHttpStatus, EnumLogLevel } from "../../../../config/enums";
import userModel from "../../../models/user";
import log from "../../../utils/logger";
import { IGetAllUsersResult } from "./index.types";

const LOG_PREFIX = '[UserService] getAll';

const getAll = async (): Promise<IGetAllUsersResult> => {
  const users = await userModel.getAll();

  log(EnumLogLevel.INFO, `${LOG_PREFIX}: Users retrieved successfully. Number of users: ${users.length}`);

  return {
    success: true,
    status: EnumHttpStatus.OK,
    message: 'Users retrieved successfully',
    data: users
  }
}

export default getAll;