import { Phase } from './phase';

export interface Project {
  active: unknown;
  id: string;
  title: string;
  creatorId: string;
  members: string[];
  phases: Phase[];
  createdAt: string;
  updatedAt: string;
}