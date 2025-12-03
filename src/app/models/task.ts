export interface Task {
  id?: string;
  _id?: any;            // backend può ritornare _id object
  projectId?: string;
  phaseId?: string;     
  title: string;
  description?: string;
  labels?: string[];
  assignees?: string[]; // array di userId (hex)
  dueDate?: string;
  createdBy?: string;
  status?: string;      
  createdAt?: string;
  updatedAt?: string;
}
