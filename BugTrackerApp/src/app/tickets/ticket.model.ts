import { Employee } from "../employee/employee.model";
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
  assignedTo: Employee;
  history: any[];
}
