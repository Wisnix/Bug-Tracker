import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { Employee } from "../employee.model";
import { AuthService } from "src/app/auth/auth.service";
import { EmployeeService } from "../employee.service";
import { Team } from "src/app/teams/team.model";

@Component({
  selector: "app-employee-list",
  templateUrl: "./employee-list.component.html",
  styleUrls: ["./employee-list.component.css"],
})
export class EmployeeListComponent implements OnInit, OnDestroy {
  projectId: string;
  teams: Team[] = [];
  employees: Employee[] = [];
  employeesSub: Subscription;
  unassignedEmployees: Employee[] = [];
  unassignedEmployeesSub: Subscription;

  constructor(private employeeService: EmployeeService, private authService: AuthService) {}

  ngOnInit() {
    this.projectId = this.authService.loggedEmployee.team.project._id;
    this.employeesSub = this.employeeService.findEmployeesByProject(this.projectId).subscribe(({ employees, teams }) => {
      this.employees = employees;
      this.teams = teams;
    });
    this.unassignedEmployeesSub = this.employeeService.findEmployees("", "", "true").subscribe((unassignedEmployees) => {
      this.unassignedEmployees = unassignedEmployees;
      console.log(unassignedEmployees);
    });
  }
  ngOnDestroy() {
    this.employeesSub.unsubscribe();
    this.unassignedEmployeesSub.unsubscribe();
  }
  onAssignEmployees(assignedEmployees) {
    this.employees = [...this.employees, ...assignedEmployees];
  }
  onUnassignEmployees(unassignedEmployees) {
    this.unassignedEmployees = [...unassignedEmployees, ...this.unassignedEmployees];
  }
}
