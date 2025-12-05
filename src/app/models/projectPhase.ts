import { Task } from './task';

export interface ProjectPhase {
  name: string;
  active?: boolean;
  order?:  number | undefined;
  phaseId?: string;
  tasks: Task[] | undefined;      // da fare
  tasksDone: Task[] | undefined; // complete
}