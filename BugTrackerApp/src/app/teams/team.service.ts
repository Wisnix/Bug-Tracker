import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Team } from "./team.model";

@Injectable({ providedIn: "root" })
export class TeamService {
  constructor(private http: HttpClient) {}

  getTeams(projectId: string) {
    return this.http.get<Team[]>("http://localhost:5000/api/teams", { params: { projectId } });
  }
}
