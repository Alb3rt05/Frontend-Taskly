import { Task } from './task';

export interface ProjectPhase {
  name: string;
  phaseId?: string;
  tasks: Task[];      // da fare
  tasksDone: Task[]; // complete
}