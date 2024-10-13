import { z } from 'zod';

export const newTaskSchema = z.object({
  name: z.string().min(1, 'Name is required'),
});

export type INewTaskData = z.infer<typeof newTaskSchema>;