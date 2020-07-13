import { Employee } from "../employee/employee.model";
import { Team } from "../teams/team.model";

export interface Project {
  _id: string;
  title: string;
  description: string;
  status: string;
  employees: Employee[];
  teams: Team[];
}
