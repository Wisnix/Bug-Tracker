import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject, Observable } from "rxjs";
import { Ticket } from "./ticket.model";
import { Router } from "@angular/router";

@Injectable({ providedIn: "root" })
export class TicketService {
  constructor(private http: HttpClient) {}

  getTickets(projectId?: string) {
    return this.http.get<Ticket[]>("http://localhost:5000/api/tickets", projectId ? { params: { project: projectId } } : {});
  }
  getTicket(number: number) {
    return this.http.get<Ticket>(`http://localhost:5000/api/tickets/${number}`);
  }
  findTicketByNumber(projectId: string, number: number) {
    return this.http.get<Ticket>("http://localhost:5000/api/tickets", { params: { project: projectId, number: String(number) } });
  }

  addComment(number: number, comment: String) {
    return this.http.post<{ message: String; comment: Comment; ticketHistory }>(`http://localhost:5000/api/tickets/${number}/comments`, { comment });
  }

  getFile(number: number, fileName: String) {
    return this.http.get(`http://localhost:5000/api/tickets/${number}/files/${fileName}`, { responseType: "blob" });
  }

  createTicket(ticket) {
    const ticketData = new FormData();
    ticketData.append("title", ticket.title);
    ticketData.append("project", ticket.project);
    ticketData.append("description", ticket.description);
    ticketData.append("assignedTo", ticket.assignedTo);
    ticketData.append("team", ticket.team);
    ticketData.append("priority", ticket.priority);
    ticketData.append("type", ticket.type);
    for (let file of ticket.files) {
      ticketData.append("files", file.file);
    }
    return this.http.post<{ message: string; ticket: Ticket }>("http://localhost:5000/api/tickets", ticketData);
  }

  updateTicket(number: number, changes: any[]) {
    return this.http.patch(`http://localhost:5000/api/tickets/${number}`, { changes });
  }
}
