import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subject, Subscription } from "rxjs";
import { Ticket } from "../ticket.model";
import { TicketService } from "../ticket.service";
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-ticket-list",
  templateUrl: "./ticket-list.component.html",
  styleUrls: ["./ticket-list.component.css"],
})
export class TicketListComponent implements OnInit, OnDestroy {
  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject();
  tickets: Ticket[] = [];
  ticketsSub: Subscription;
  constructor(private ticketService: TicketService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    //table options
    this.dtOptions = {
      autoWidth: false,
      pagingType: "full_numbers",
      columns: [{ width: "20%" }, { width: "60%" }, { width: "20%" }],
    };
    //fetch tickets

    this.ticketsSub = this.ticketService.getTickets().subscribe((tickets) => {
      this.tickets = tickets;
      this.dtTrigger.next();
    });
  }

  onSelectTicket(ticketNumber: number) {
    this.router.navigate([ticketNumber], { relativeTo: this.route });
  }

  ngOnDestroy() {
    this.ticketsSub.unsubscribe();
  }
}
