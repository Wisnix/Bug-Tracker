import { NgModule } from "@angular/core";
import { TicketsComponent } from "./tickets.component";
import { NewTicketComponent } from "./new-ticket/new-ticket.component";
import { RouterModule } from "@angular/router";
import { SharedModule } from "../shared/shared.module";
import { TicketsRoutingModule } from "./tickets-routing.module";
import { SelectTicketComponent } from "./select-ticket/select-ticket.component";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgxDropzoneModule } from "ngx-dropzone";
import { DataTablesModule } from "angular-datatables";

@NgModule({
  declarations: [TicketsComponent, NewTicketComponent, SelectTicketComponent],
  imports: [
    RouterModule,
    TicketsRoutingModule,
    SharedModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDropzoneModule,
    DataTablesModule,
  ],
})
export class TicketsModule {}
