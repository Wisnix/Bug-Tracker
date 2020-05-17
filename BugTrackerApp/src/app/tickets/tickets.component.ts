import { Component, OnInit } from "@angular/core";
import { Ticket } from "./ticket.model";
import { TicketService } from "./ticket.service";
import { AuthService } from "../auth/auth.service";

@Component({
  selector: "app-tickets",
  templateUrl: "./tickets.component.html",
  styleUrls: ["./tickets.component.css"],
})
export class TicketsComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
  tickets: Ticket[] = [];
  constructor(private ticketService: TicketService) {}

  ngOnInit() {
    //table options
    this.dtOptions = {
      pagingType: "full_numbers",
    };
    //fetch tickets
    this.ticketService.getTickets();
    this.ticketService.getTicketsUpdatedListener().subscribe((tickets) => {
      this.tickets = tickets;
    });
  }
}
