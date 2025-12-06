export interface Task {
  id: string;
  projectId: string;
  phaseId: string;
  title: string;
  description?: string;
  labels?: string[];
  assignees?: string[];
  dueDate?: string;
  createdBy?: string;
  status?: string;      // 'TODO' | 'done'
  createdAt?: string;
  updatedAt?: string;
}
