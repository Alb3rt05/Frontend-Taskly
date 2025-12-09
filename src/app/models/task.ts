export interface Task {
  id: string;
  projectId: string;
  phaseId: string;
  title: string;
  description?: string;
  labels?: string[];
  assignees?: string[];
  dueDate?: string;
  status?: string;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}