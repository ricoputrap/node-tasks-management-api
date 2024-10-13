import { EnumHttpStatus, EnumLogLevel } from "../../../../config/enums";
import BadRequestError from "../../../errors/BadRequestError";
import NotFoundError from "../../../errors/NotFoundError";
import userModel from "../../../models/user";
import log from "../../../utils/logger";
import { IDeleteUserResult } from "./index.types";

const LOG_PREFIX = '[UserService] archive';

const archiveOne = async (userID: number): Promise<IDeleteUserResult> => {
  // get user
  const user = await userModel.getUserById(userID);

  // user not found
  if (!user) {
    const message = `User with ID ${userID} not found.`;
    log(EnumLogLevel.ERROR, `${LOG_PREFIX}: ${message}`);
    throw new NotFoundError(message);
  }

  // user already archived
  if (!user.active) {
    const message = `User with ID ${userID} is already archived.`;
    log(EnumLogLevel.ERROR, `${LOG_PREFIX}: ${message}`);
    throw new BadRequestError(message);
  }

  await userModel.archiveUser(userID);
  log(EnumLogLevel.INFO, `${LOG_PREFIX}: User archived successfully. User ID: ${userID}`);

  return {
    success: true,
    status: EnumHttpStatus.OK,
    message: 'User archived successfully'
  }
}

export default archiveOne;