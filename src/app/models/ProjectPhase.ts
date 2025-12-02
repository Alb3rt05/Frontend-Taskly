import { Task } from './task';

export interface ProjectPhase {
  name: string;
  tasks: Task[];
}
