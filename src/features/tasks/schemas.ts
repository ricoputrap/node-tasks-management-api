import { z } from 'zod';
import { EnumTaskStatus } from '../../../config/enums';

export const newTaskSchema = z.object({
  name: z.string().min(1, 'Name is required'),
});

export type INewTaskSchema = z.infer<typeof newTaskSchema>;

export const editTaskSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  status: z.enum([EnumTaskStatus.TODO, EnumTaskStatus.IN_PROGRESS, EnumTaskStatus.DONE])
});

export type IEditTaskSchema = z.infer<typeof editTaskSchema>;