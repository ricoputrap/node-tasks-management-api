import { EnumHttpStatus, EnumLogLevel } from "../../../../config/enums";
import NotFoundError from "../../../errors/NotFoundError";
import userModel from "../../../models/user";
import log from "../../../utils/logger";
import { IGetOneUserResult } from "./index.types";

const LOG_PREFIX = '[UserService] getById';

const getById = async (userID: number): Promise<IGetOneUserResult> => {
  const user = await userModel.getUserById(userID);

  if (!user) {
    const message = `User with ID ${userID} not found.`;
    log(EnumLogLevel.ERROR, `${LOG_PREFIX}: ${message}`);
    throw new NotFoundError(message);
  }

  log(EnumLogLevel.INFO, `${LOG_PREFIX}: User retrieved successfully. User ID: ${userID}`);

  return {
    success: true,
    status: EnumHttpStatus.OK,
    message: 'User retrieved successfully',
    data: user
  }
}

export default getById