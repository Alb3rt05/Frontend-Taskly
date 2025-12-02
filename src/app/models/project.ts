import { Task } from "./task";

export interface Project {
  id: string;
  title: string;
  tasks: Task[];
  active?: boolean;
  // altri campi dal backend
}