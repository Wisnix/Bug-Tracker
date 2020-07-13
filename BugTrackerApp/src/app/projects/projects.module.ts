import { NgModule } from "@angular/core";
import { ProjectsComponent } from "./projects.component";
import { SharedModule } from "../shared/shared.module";
import { ProjectsRoutingModule } from "./projects-routing.module";
import { ProjectListComponent } from "./project-list/project-list.component";
import { NewProjectComponent } from "./new-project/new-project.component";
import { MatStepperModule } from "@angular/material/stepper";
import { MatExpansionModule } from "@angular/material/expansion";
import { SelectProjectComponent } from './select-project/select-project.component';

@NgModule({
  declarations: [ProjectsComponent, ProjectListComponent, NewProjectComponent, SelectProjectComponent],
  imports: [SharedModule, ProjectsRoutingModule, MatStepperModule, MatExpansionModule],
})
export class ProjectsModule {}
