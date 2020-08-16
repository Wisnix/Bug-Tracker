import { Employee } from "../employees/employee.model";
import { Team } from "../teams/team.model";

export interface Ticket {
  number: number;
  title: string;
  project: string;
  description: string;
  devResources: string[];
  files: any[];
  createdOn: Date;
  status: string;
  raisedBy: Employee;
  comments: Comment[];
  team: Team;
  priority: string;
  type: string;
  assignedTo: Employee;
  history: any[];
}
