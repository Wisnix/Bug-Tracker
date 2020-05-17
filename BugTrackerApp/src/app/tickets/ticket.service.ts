import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { Ticket } from "./ticket.model";
import { AuthService } from "../auth/auth.service";

@Injectable({ providedIn: "root" })
export class TicketService {
  tickets: Ticket[] = [];
  ticketsUpdated = new Subject<Ticket[]>();
  constructor(private http: HttpClient) {}

  getTickets() {
    this.http.get<Ticket[]>("http://localhost:5000/api/ticket").subscribe((tickets) => {
      this.tickets = [...tickets];
      this.ticketsUpdated.next([...tickets]);
    });
  }

  createTicket(ticket: Ticket) {
    const ticketData = new FormData();
    ticketData.append("title", ticket.title);
    ticketData.append("project", ticket.project);
    ticketData.append("description", ticket.description);
    ticketData.append("devResources", JSON.stringify(ticket.devResources));
    for (let file of ticket.files) {
      ticketData.append("files", file.file);
    }
    console.log(ticketData);
    this.http.post<{ message: string; ticket: Ticket }>("http://localhost:5000/api/ticket", ticketData).subscribe((res) => {
      console.log(res.ticket);
    });
  }

  getTicketsUpdatedListener() {
    return this.ticketsUpdated.asObservable();
  }
}
