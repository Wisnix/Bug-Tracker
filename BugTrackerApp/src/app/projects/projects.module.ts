import { NgModule } from "@angular/core";
import { ProjectsComponent } from "./projects.component";
import { SharedModule } from "../shared/shared.module";
import { ProjectsRoutingModule } from "./projects-routing.module";
import { ProjectListComponent } from "./project-list/project-list.component";
import { NewProjectComponent } from "./new-project/new-project.component";
import { MatStepperModule } from "@angular/material/stepper";
import { MatExpansionModule } from "@angular/material/expansion";
import { SelectProjectComponent } from "./select-project/select-project.component";
import { NotAssignedComponent } from "./not-assigned/not-assigned.component";
import { MatCardModule } from "@angular/material/card";
import { MatPaginatorModule } from "@angular/material/paginator";
import { DataTablesModule } from "angular-datatables";
import { MatFormFieldModule } from "@angular/material/form-field";
import { ReactiveFormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { MatSelectModule } from "@angular/material/select";
import { MatButtonModule } from "@angular/material/button";

@NgModule({
  declarations: [ProjectsComponent, ProjectListComponent, NewProjectComponent, SelectProjectComponent, NotAssignedComponent],
  imports: [
    ReactiveFormsModule,
    SharedModule,
    MatIconModule,
    MatListModule,
    MatSelectModule,
    MatButtonModule,
    ProjectsRoutingModule,
    MatStepperModule,
    MatExpansionModule,
    MatCardModule,
    MatPaginatorModule,
    DataTablesModule,
    MatFormFieldModule,
  ],
})
export class ProjectsModule {}
