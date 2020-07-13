import { NgModule } from "@angular/core";
import { TicketsComponent } from "./tickets.component";
import { NewTicketComponent } from "./new-ticket/new-ticket.component";
import { SharedModule } from "../shared/shared.module";
import { TicketsRoutingModule } from "./tickets-routing.module";
import { SelectTicketComponent } from "./select-ticket/select-ticket.component";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatIconModule } from "@angular/material/icon";
import { NgxDropzoneModule } from "ngx-dropzone";
import { TicketListComponent } from "./ticket-list/ticket-list.component";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatListModule } from "@angular/material/list";
import { EditTicketComponent } from './edit-ticket/edit-ticket.component';

@NgModule({
  declarations: [TicketsComponent, NewTicketComponent, SelectTicketComponent, TicketListComponent, EditTicketComponent],
  imports: [SharedModule, TicketsRoutingModule, MatSelectModule, NgxDropzoneModule, MatGridListModule, MatListModule],
})
export class TicketsModule {}
