import { Task } from './task';

export interface ProjectPhase {
  name: string;
  phaseId?: string;
  tasks: Task[];
}
