import { NgModule } from "@angular/core";
import { ProjectsComponent } from "./projects.component";
import { RouterModule, Router } from "@angular/router";
import { ProjectListComponent } from "./project-list/project-list.component";
import { NewProjectComponent } from "./new-project/new-project.component";
import { SelectProjectComponent } from "./select-project/select-project.component";

const routes = [
  {
    path: "",
    component: ProjectsComponent,
    children: [
      { path: "", component: ProjectListComponent },
      { path: "new", component: NewProjectComponent },
      { path: ":id", component: SelectProjectComponent },
    ],
  },
];

@NgModule({ imports: [RouterModule.forChild(routes)], exports: [RouterModule] })
export class ProjectsRoutingModule {}
