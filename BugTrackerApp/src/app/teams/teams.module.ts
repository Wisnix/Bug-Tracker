import { NgModule } from "@angular/core";
import { TeamsComponent } from "./teams.component";
import { TeamListComponent } from "./team-list/team-list.component";
import { SharedModule } from "../shared/shared.module";
import { TeamsRoutingModule } from "./teams-routing.module";

@NgModule({ declarations: [TeamsComponent, TeamListComponent], imports: [SharedModule, TeamsRoutingModule] })
export class TeamsModule {}
