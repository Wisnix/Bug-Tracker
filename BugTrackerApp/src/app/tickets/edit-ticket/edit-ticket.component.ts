import { Component, OnInit } from "@angular/core";
import { Team } from "src/app/teams/team.model";
import { ReplaySubject, Subscription } from "rxjs";
import { FormControl, FormGroup, Validators, FormArray } from "@angular/forms";
import { Employee } from "src/app/employees/employee.model";
import { TicketService } from "../ticket.service";
import { AuthService } from "src/app/auth/auth.service";
import { TeamService } from "src/app/teams/team.service";
import { EmployeeService } from "src/app/employees/employee.service";
import { Ticket } from "../ticket.model";
import { ActivatedRoute } from "@angular/router";
import { switchMap, flatMap } from "rxjs/operators";
import { Location } from "@angular/common";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-edit-ticket",
  templateUrl: "./edit-ticket.component.html",
  styleUrls: ["./edit-ticket.component.css"],
})
export class EditTicketComponent implements OnInit {
  ticket: Ticket;
  ticketSub: Subscription;
  projectId: string;
  files = [];
  teams: Team[] = [];
  filteredTeams: ReplaySubject<Team[]> = new ReplaySubject<Team[]>();
  teamFilterControl: FormControl = new FormControl();
  teamsSubscription: Subscription;
  employees: Employee[] = [];
  filteredEmployees: ReplaySubject<Employee[]> = new ReplaySubject<Employee[]>();
  employeeFilterControl: FormControl = new FormControl();
  ticketForm: FormGroup;

  constructor(
    private ticketService: TicketService,
    private authService: AuthService,
    private teamService: TeamService,
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private location: Location,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    //Fetch ticket and employees
    this.ticketSub = this.route.params
      .pipe(
        switchMap((params) => this.ticketService.getTicket(params.id)),
        switchMap((ticket) => {
          this.ticket = ticket;
          this.ticketForm.get("title").setValue(this.ticket.title);
          this.ticketForm.get("description").setValue(this.ticket.description);
          this.ticketForm.get("team").setValue(this.ticket.team._id);
          this.ticketForm.get("assignedTo").setValue(this.ticket.assignedTo?._id);
          this.ticketForm.get("status").setValue(this.ticket.status);
          this.ticketForm.get("priority").setValue(this.ticket.priority);
          return this.employeeService.findEmployeesByTeam(ticket.team._id);
        })
      )
      .subscribe((employees) => {
        this.employees = employees;
        this.filteredEmployees.next(this.employees.slice());
      });
    //Fetch teams
    this.projectId = this.authService.getProjectId();
    this.teamsSubscription = this.teamService.getTeams(this.projectId).subscribe((teams) => {
      this.teams = teams;
      this.filteredTeams.next(this.teams.slice());
    });

    this.teamFilterControl.valueChanges.subscribe(() => {
      this.filterTeams();
    });
    this.employeeFilterControl.valueChanges.subscribe(() => {
      this.filterEmployees();
    });
    this.initForm();
  }

  private initForm() {
    this.ticketForm = new FormGroup({
      title: new FormControl("", [Validators.required]),
      status: new FormControl("", [Validators.required]),
      description: new FormControl("", [Validators.required]),
      team: new FormControl("", [Validators.required]),
      priority: new FormControl("", [Validators.required]),
      assignedTo: new FormControl("", [Validators.required]),
    });
  }

  onLoadEmployees(event) {
    this.employeeService.findEmployeesByTeam(event.value).subscribe((employees) => {
      this.employees = employees;
      this.filteredEmployees.next(this.employees.slice());
    });
  }
  private filterTeams() {
    if (!this.teams) {
      return;
    }
    let search = this.teamFilterControl.value;
    if (!search) {
      this.filteredTeams.next(this.teams.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredTeams.next(this.teams.filter((team) => team.name.toLowerCase().indexOf(search) > -1));
  }

  private filterEmployees() {
    if (!this.employees) {
      return;
    }
    let search = this.employeeFilterControl.value;
    if (!search) {
      this.filteredEmployees.next(this.employees.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredEmployees.next(this.employeeService.filterEmployeesArray(this.employees, search));
  }

  onEditTicket() {
    const changes = [];
    const ticketFormValue = this.ticketForm.value;
    if (ticketFormValue.title !== this.ticket.title) {
      changes.push({ attribute: "title", oldValue: this.ticket.title, newValue: ticketFormValue.title });
    }
    if (ticketFormValue.assignedTo !== this.ticket.assignedTo?._id) {
      const employee = this.employees.find((e) => e._id === ticketFormValue.assignedTo);
      changes.push({
        attribute: "assignedTo",
        oldValue: `${this.ticket.assignedTo?.firstName || ""} ${this.ticket.assignedTo?.lastName || ""}`,
        newValue: `${employee.firstName} ${employee.lastName}`,
        id: ticketFormValue.assignedTo,
      });
    }
    if (ticketFormValue.team !== this.ticket.team._id) {
      const team = this.teams.find((team) => team._id === ticketFormValue.team);
      changes.push({ attribute: "team", oldValue: this.ticket.team.name, newValue: team.name, id: ticketFormValue.team });
    }
    if (ticketFormValue.description !== this.ticket.description) {
      changes.push({ attribute: "description", oldValue: this.ticket.description, newValue: ticketFormValue.description });
    }
    if (ticketFormValue.status !== this.ticket.status) {
      changes.push({ attribute: "status", oldValue: this.ticket.status, newValue: ticketFormValue.status });
    }
    if (ticketFormValue.priority !== this.ticket.priority) {
      changes.push({ attribute: "priority", oldValue: this.ticket.priority, newValue: ticketFormValue.priority });
    }
    if (changes.length) {
      this.ticketService.updateTicket(this.ticket.number, changes).subscribe((response) => {
        this.location.back();
        this._snackBar.open(`Ticket ${this.ticket.number} updated `, "", {
          duration: 2000,
          verticalPosition: "top",
          panelClass: "snackbar-success",
        });
      });
    }
  }
}
