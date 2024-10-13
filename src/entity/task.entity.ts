import { EnumTaskStatus } from "../../config/enums";

interface ITask {
  id: number;
  name: string;
  status: EnumTaskStatus;
  user_id: number; // FK to USER.id
}

export default ITask;