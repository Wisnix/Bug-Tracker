import { NgModule } from "@angular/core";
import { TeamsComponent } from "./teams.component";
import { TeamListComponent } from "./team-list/team-list.component";
import { SharedModule } from "../shared/shared.module";
import { TeamsRoutingModule } from "./teams-routing.module";
import { DataTablesModule } from "angular-datatables";
import { MatCardModule } from "@angular/material/card";
import { MatLabel, MatFormFieldModule } from "@angular/material/form-field";
import { FormsModule } from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";

@NgModule({
  declarations: [TeamsComponent, TeamListComponent],
  imports: [SharedModule, TeamsRoutingModule, DataTablesModule, MatCardModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
})
export class TeamsModule {}
