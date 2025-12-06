import { Task } from './task';

export interface ProjectPhase {
  name: string;
  active: boolean;
  order: number;
  phaseId: string;
  tasks: Task[];
  tasksDone: Task[];
}
