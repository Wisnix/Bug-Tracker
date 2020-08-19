import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subject, Subscription } from "rxjs";
import { Ticket } from "../ticket.model";
import { TicketService } from "../ticket.service";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthService } from "src/app/auth/auth.service";

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
  projectId: string;
  constructor(private ticketService: TicketService, private router: Router, private route: ActivatedRoute, private authService: AuthService) {}

  ngOnInit() {
    this.projectId = this.authService.getProjectId();
    //table options
    this.dtOptions = {
      autoWidth: false,
      pagingType: "full_numbers",
      columns: [{ width: "20%" }, { width: "60%" }, { width: "20%" }],
    };
    //fetch tickets
    this.ticketsSub = this.ticketService.getTickets(this.projectId).subscribe((tickets) => {
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
