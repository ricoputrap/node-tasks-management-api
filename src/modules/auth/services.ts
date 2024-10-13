import IUserModel, { INewUser } from '../../models/user/index.types';
import UserModel from '../../models/user';
import { IUserRegistrationData } from './schemas';
import IUser from '../../entity/user.entity';
import { EnumHttpStatus, EnumLogLevel } from '../../../config/enums';
import log from '../../utils/logger';
import { encrypt } from '../../utils/passwordHashing';

const LOG_PREFIX = '[AuthService]';

export interface IOperationResult<T> {
  success: boolean;
  status: EnumHttpStatus;
  data?: T;
  message?: string;
  errors?: Record<string, string>;
}

export interface ICreateUserResult extends IOperationResult<Omit<IUser, "password" | "active">> { }

export interface IAuthService {
  register(userData: IUserRegistrationData): Promise<ICreateUserResult>;
}

class AuthService implements IAuthService {
  private userModel: IUserModel;

  constructor() {
    this.userModel = new UserModel();
  }

  async register(userData: IUserRegistrationData): Promise<ICreateUserResult> {
    try {
      const result: ICreateUserResult = {
        success: true,
        status: EnumHttpStatus.CREATED
      };

      // get the user to check if user already exists
      const existingUser = await this.userModel.getUserByEmail(userData.email);

      // user already exists
      if (existingUser) {
        result.message = "Email already exists";
        result.status = EnumHttpStatus.CONFLICT;

        log(EnumLogLevel.ERROR, `${LOG_PREFIX} register: User already exists with email "${userData.email}"`);
        return result;
      }

      // hash the password
      const hashedPassword = encrypt(userData.password);

      // create the user
      const newUser: INewUser = await this.userModel.createUser({
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        role: userData.role
      });

      // prepare the response
      result.data = newUser;
      result.message = "User created successfully";

      const msg = `${LOG_PREFIX} register: User created successfully with email "${userData.email}" and id ${newUser.id}`;
      log(EnumLogLevel.INFO, msg);

      return result;
    }
    catch (error: any) {
      log(EnumLogLevel.ERROR, `${LOG_PREFIX} register: ${error.message}`);
      throw error;
    }
  }
}

export default AuthService;