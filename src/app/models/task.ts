export interface Task {
  id?: string;         // Normalizzato DTO Backend  
  _id?: any;           // momentaneo per poter lavorare con l'API  projectId?: string;
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
