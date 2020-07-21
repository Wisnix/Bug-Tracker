import { Project } from "../projects/project.model";

export interface Team {
  _id: string;
  name: string;
  employees: [];
  project: Project;
  openTickets?: number;
  closedTickets?: number;
}
