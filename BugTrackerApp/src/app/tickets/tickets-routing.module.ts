import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { TicketsComponent } from "./tickets.component";
import { NewTicketComponent } from "./new-ticket/new-ticket.component";
import { SelectTicketComponent } from "./select-ticket/select-ticket.component";

const routes: Routes = [
  {
    path: "",
    component: TicketsComponent,
    children: [
      { path: "new", component: NewTicketComponent },
      { path: ":id", component: SelectTicketComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TicketsRoutingModule {}
