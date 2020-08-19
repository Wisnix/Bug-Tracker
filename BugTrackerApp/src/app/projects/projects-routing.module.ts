import { NgModule } from "@angular/core";
import { ProjectsComponent } from "./projects.component";
import { RouterModule, Router } from "@angular/router";
import { ProjectListComponent } from "./project-list/project-list.component";
import { NewProjectComponent } from "./new-project/new-project.component";
import { SelectProjectComponent } from "./select-project/select-project.component";
import { TeamListComponent } from "../teams/team-list/team-list.component";
import { NotAssignedComponent } from "./not-assigned/not-assigned.component";
import { EmployeeListComponent } from "../employees/employee-list/employee-list.component";

const routes = [
  {
    path: "",
    component: ProjectsComponent,
    children: [
      { path: "", component: ProjectListComponent },
      { path: "new", component: NewProjectComponent },
      { path: "unassigned", component: NotAssignedComponent },
      { path: ":id", component: SelectProjectComponent },
      { path: ":id/teams", component: TeamListComponent },
      { path: ":id/employees", component: EmployeeListComponent },
    ],
  },
];

@NgModule({ imports: [RouterModule.forChild(routes)], exports: [RouterModule] })
export class ProjectsRoutingModule {}
