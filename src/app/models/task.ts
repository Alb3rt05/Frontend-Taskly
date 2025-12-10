export interface Task {
  id: string;
  projectId: string;
  phaseId: string;
  title: string;
  description?: string;
  labels?: string[];
  assignees?: string[];
  dueDate?: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}