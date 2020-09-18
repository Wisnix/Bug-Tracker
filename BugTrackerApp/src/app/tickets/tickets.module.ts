import { NgModule } from "@angular/core";
import { TicketsComponent } from "./tickets.component";
import { NewTicketComponent } from "./new-ticket/new-ticket.component";
import { SharedModule } from "../shared/shared.module";
import { TicketsRoutingModule } from "./tickets-routing.module";
import { SelectTicketComponent } from "./select-ticket/select-ticket.component";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatIconModule, MatIcon } from "@angular/material/icon";
import { NgxDropzoneModule } from "ngx-dropzone";
import { TicketListComponent } from "./ticket-list/ticket-list.component";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatListModule } from "@angular/material/list";
import { EditTicketComponent } from "./edit-ticket/edit-ticket.component";
import { DataTablesModule } from "angular-datatables";
import { NgxMatSelectSearchModule } from "ngx-mat-select-search";
import { MatCardModule } from "@angular/material/card";
import { MatOptionModule } from "@angular/material/core";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";

@NgModule({
  declarations: [TicketsComponent, NewTicketComponent, SelectTicketComponent, TicketListComponent, EditTicketComponent],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    SharedModule,
    TicketsRoutingModule,
    MatFormFieldModule,
    NgxMatSelectSearchModule,
    MatSelectModule,
    MatIconModule,
    NgxDropzoneModule,
    MatGridListModule,
    MatListModule,
    MatButtonModule,
    DataTablesModule,
    MatCardModule,
    MatOptionModule,
  ],
})
export class TicketsModule {}
