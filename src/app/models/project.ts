import { Phase } from './phase';
import { Task } from './task';

export interface Project {
  ownerId: any;        // momentaneo per poter lavorare con l'API
  name: any;
  id?: string;         // Normalizzato DTO Backend
  _id?: any;           // momentaneo per poter lavorare con l'API
  title: string;
  creatorId?: string;
  members?: string[];  // stringhe hex
  phases?: Phase[];
  tasks?: Task[];      // opzionale, popolato lato frontend dopo fetch tasks
  createdAt?: string;
  updatedAt?: string;
  active?: boolean;
}
