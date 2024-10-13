import { IncomingMessage, ServerResponse } from 'http';
import authorize from '../../decorators/authorize';
import { EnumUserRole } from '../../../config/enums';

const LOG_PREFIX = '[UserController]';

class UserController {

  @authorize([EnumUserRole.ADMIN])
  public get(req: IncomingMessage, res: ServerResponse) {
    const userID = Number(req.url?.split("/")[3]);

    if (userID) {
      this.getById(req, res, userID);
    }
    else {
      this.getAll(req, res);
    }
  }

  private async getAll(req: IncomingMessage, res: ServerResponse) {
    res.end();
  }

  private async getById(req: IncomingMessage, res: ServerResponse, userID: number) {
    res.end();
  }

  @authorize([EnumUserRole.ADMIN])
  public async delete(req: IncomingMessage, res: ServerResponse) {
    res.end();
  }
}

export default UserController;