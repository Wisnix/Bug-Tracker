import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators, FormArray } from "@angular/forms";
import { TicketService } from "../ticket.service";
import { AuthService } from "src/app/auth/auth.service";
import { Subscription, ReplaySubject } from "rxjs";
import { TeamService } from "src/app/teams/team.service";
import { Team } from "src/app/teams/team.model";
import { Employee } from "src/app/employees/employee.model";
import { EmployeeService } from "src/app/employees/employee.service";
import { Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-new-ticket",
  templateUrl: "./new-ticket.component.html",
  styleUrls: ["./new-ticket.component.css"],
})
export class NewTicketComponent implements OnInit {
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
    private router: Router,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.projectId = this.authService.loggedEmployee.team.project._id;
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
      project: new FormControl(this.projectId),
      description: new FormControl("", [Validators.required]),
      team: new FormControl("", [Validators.required]),
      assignedTo: new FormControl("", [Validators.required]),
      type: new FormControl("", [Validators.required]),
      priority: new FormControl("", [Validators.required]),
      files: new FormArray([]),
    });
  }

  onNewTicket() {
    console.log(this.ticketForm.valid);
    console.log(this.ticketForm.value);
    if (this.ticketForm.valid)
      this.ticketService.createTicket(this.ticketForm.value).subscribe((res) => {
        if (res.ticket) {
          this.router.navigate(["tickets/", res.ticket.number]);
          this._snackBar.open("Ticket created sucessfully", "", {
            duration: 2000,
            verticalPosition: "top",
            panelClass: "snackbar-success",
          });
        }
      });
  }
  onSelect(event) {
    for (let file of event.addedFiles) {
      const newFile = new FormControl({ file });
      (<FormArray>this.ticketForm.get("files")).push(newFile);
    }
    this.files.push(...event.addedFiles);
  }
  onRemove(event) {
    console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
    let formArray = <FormArray>this.ticketForm.get("files");
    formArray.clear();
    for (let file of this.files) {
      const newFile = new FormControl({ file });
      (<FormArray>this.ticketForm.get("files")).push(newFile);
    }
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
}
