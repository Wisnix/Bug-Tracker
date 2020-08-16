import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Project } from "./project.model";
import { Ticket } from "../tickets/ticket.model";

@Injectable({ providedIn: "root" })
export class ProjectService {
  constructor(private http: HttpClient, private router: Router) {}

  getProject(id: string) {
    return this.http.get<{ project: Project; tickets: Ticket[] }>(`http://localhost:5000/api/projects/${id}`);
  }

  getProjects() {
    return this.http.get<Project[]>("http://localhost:5000/api/projects");
  }

  getProjectStatistics(id: string) {
    return this.http.get<any>(`http://localhost:5000/api/projects/${id}/statistics`);
  }

  createProject(project: Project) {
    this.http
      .post<{ message: String; project: Project }>("http://localhost:5000/api/projects", { project })
      .subscribe(({ message, project }) => {
        console.log(message);
        console.log(project);
      });
  }
}
