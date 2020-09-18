import { Component, OnInit, OnDestroy } from "@angular/core";
import { Ticket } from "../ticket.model";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { TicketService } from "../ticket.service";
import { Subscription, Subject } from "rxjs";
import { switchMap } from "rxjs/operators";
import { FormControl } from "@angular/forms";
import { saveAs } from "file-saver";

@Component({
  selector: "app-select-ticket",
  templateUrl: "./select-ticket.component.html",
  styleUrls: ["./select-ticket.component.css"],
})
export class SelectTicketComponent implements OnInit, OnDestroy {
  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject();
  isLoading: boolean = false;
  ticket: Ticket;
  ticketSub: Subscription;
  comment: FormControl = new FormControl();
  constructor(private route: ActivatedRoute, private ticketService: TicketService, private router: Router) {}

  ngOnInit(): void {
    //table options
    this.dtOptions = {
      autoWidth: false,
      paging: false,
      info: false,
      searching: false,
      responsive: true,
      columns: [{ width: "10%" }, { width: "15%" }, { width: "32.5%" }, { width: "30%" }, { width: "12.5%" }],
    };
    this.isLoading = true;
    this.ticketSub = this.route.params.pipe(switchMap((params) => this.ticketService.getTicket(params.id))).subscribe((ticket) => {
      this.ticket = ticket;
      this.isLoading = false;
      setTimeout(() => {
        this.dtTrigger.next();
      }, 0);
    });
  }
  ngOnDestroy() {
    this.ticketSub.unsubscribe();
  }

  onDownloadFile(fileId: string, fileName: string) {
    this.ticketService.getFile(this.ticket.number, fileId).subscribe((res) => {
      var blob = new Blob([res], { type: res.type });
      saveAs(blob, fileName);
    });
  }

  onNewComment() {
    this.ticketService.addComment(this.ticket.number, this.comment.value).subscribe(({ message, comment, ticketHistory }) => {
      this.ticket.comments.push(comment);
      this.ticket.history.push(ticketHistory);
      this.comment.reset();
    });
  }
  editTicket() {
    this.router.navigate(["edit"], { relativeTo: this.route });
  }
  test() {
    this.dtTrigger.next();
  }
}
