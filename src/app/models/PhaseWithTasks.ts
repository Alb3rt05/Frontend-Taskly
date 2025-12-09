import { Phase } from "./phase";
import { Task } from "./task";

interface PhaseWithTasks extends Phase {
  tasks: Task[];
  tasksDone: Task[];
  active?: boolean;
}
