import { Project } from "../projects/project.model";
import { Team } from "../teams/team.model";

export interface Employee {
  email: string;
  firstName: string;
  lastName: string;
  _id: string;
  role: string;
  team: Team;
  teamName?: string;
}
