import { Phase } from './phase';
import { Task } from './task';

export interface Project {
  id?: string;         
  _id?: any;           // se backend manda oggetto _id
  title: string;
  creatorId?: string;
  members?: string[];  // stringhe hex
  phases?: Phase[];    
  // tasks verrà caricata dal servizio getTasksForProject
  tasks?: Task[];      // opzionale, popolato lato frontend dopo fetch tasks
  createdAt?: string;
  updatedAt?: string;
  active?: boolean;
}
