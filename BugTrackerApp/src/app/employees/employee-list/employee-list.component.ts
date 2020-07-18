import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { Subject, Subscription, Observable } from "rxjs";
import { Employee } from "../employee.model";
import { AuthService } from "src/app/auth/auth.service";
import { EmployeeService } from "../employee.service";
import { MatTableDataSource } from "@angular/material/table";
import { SelectionModel } from "@angular/cdk/collections";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { Team } from "src/app/teams/team.model";
import { MatDialog } from "@angular/material/dialog";
import { DialogUpdateEmployeeComponent } from "./dialog-update-employee/dialog-update-employee.component";
import { switchMap } from "rxjs/operators";
import { of } from "rxjs";

@Component({
  selector: "app-employee-list",
  templateUrl: "./employee-list.component.html",
  styleUrls: ["./employee-list.component.css"],
})
export class EmployeeListComponent implements OnInit, OnDestroy {
  projectId: string;
  roles: string[] = ["Developer", "Tester", "Project Manager"];
  employees: Employee[] = [];
  teams: Team[] = [];
  employeesSub: Subscription;
  displayedColumns: string[] = ["select", "email", "firstName", "lastName", "teamName", "role"];
  assignedEmployeesDataSource = new MatTableDataSource<Employee>();
  assignedEmployeesSelection = new SelectionModel<Employee>(true, []);
  unassignedEmployeesDataSource = new MatTableDataSource<Employee>();
  unassignedEmployeesSelection = new SelectionModel<Employee>(true, []);

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private employeeService: EmployeeService, private authService: AuthService, public dialog: MatDialog) {}

  ngOnInit() {
    this.projectId = this.authService.loggedEmployee.team.project._id;
    this.employeesSub = this.employeeService.findEmployeesByProject(this.projectId).subscribe(({ employees, teams }) => {
      this.employees = employees;
      this.assignedEmployeesDataSource.paginator = this.paginator;
      this.assignedEmployeesDataSource.data = employees;
      this.teams = teams;
    });
  }
  ngOnDestroy() {
    this.employeesSub.unsubscribe();
  }
  //Methods for assigned employees
  isAllSelected() {
    const numSelected = this.assignedEmployeesSelection.selected.length;
    const numRows = this.assignedEmployeesDataSource.data.length;
    return numSelected === numRows;
  }
  masterToggle() {
    this.isAllSelected()
      ? this.assignedEmployeesSelection.clear()
      : this.assignedEmployeesDataSource.data.forEach((row) => this.assignedEmployeesSelection.select(row));
  }
  checkboxLabel(row?: Employee): string {
    if (!row) {
      return `${this.isAllSelected() ? "select" : "deselect"} all`;
    }
    return `${this.assignedEmployeesSelection.isSelected(row) ? "deselect" : "select"} row ${row.email + 1}`;
  }
  applyFilter(event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.assignedEmployeesDataSource.filter = filterValue.trim().toLowerCase();

    if (this.assignedEmployeesDataSource.paginator) {
      this.assignedEmployeesDataSource.paginator.firstPage();
    }
  }
  //Methods for unassigned employees
  isAllSelectedUnassigned() {
    const numSelected = this.unassignedEmployeesSelection.selected.length;
    const numRows = this.unassignedEmployeesDataSource.data.length;
    return numSelected === numRows;
  }
  masterToggleUnassigned() {
    this.isAllSelectedUnassigned()
      ? this.unassignedEmployeesSelection.clear()
      : this.unassignedEmployeesDataSource.data.forEach((row) => this.unassignedEmployeesSelection.select(row));
  }
  checkboxLabelUnassigned(row?: Employee): string {
    if (!row) {
      return `${this.isAllSelectedUnassigned() ? "select" : "deselect"} all`;
    }
    return `${this.unassignedEmployeesSelection.isSelected(row) ? "deselect" : "select"} row ${row.email + 1}`;
  }
  applyFilterUnassigned(event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.unassignedEmployeesDataSource.filter = filterValue.trim().toLowerCase();

    if (this.unassignedEmployeesDataSource.paginator) {
      this.unassignedEmployeesDataSource.paginator.firstPage();
    }
  }

  changeTeam(event) {
    const employees = this.assignedEmployeesSelection.selected;
    const newTeam = event.value;
    const dialogRef = this.dialog.open(DialogUpdateEmployeeComponent, {
      width: "300px",
      data: { qty: employees.length, team: newTeam.name },
    });

    dialogRef
      .afterClosed()
      .pipe(
        switchMap((confirmed) => {
          return confirmed ? this.employeeService.updateEmployees(employees, { team: newTeam._id }) : of(false);
        }),
        switchMap((employeesUpdated) => {
          return employeesUpdated ? this.employeeService.findEmployeesByProject(this.projectId) : of(false);
        })
      )
      .subscribe((response) => {
        event.source.value = "";
        if (response) {
          this.assignedEmployeesSelection.clear();
          this.employees = (<{ employees: Employee[]; teams: Team[] }>response).employees;
          this.assignedEmployeesDataSource.data = this.employees;
        }
      });
  }

  changeRole(event) {
    const employees = this.assignedEmployeesSelection.selected;
    const newRole = event.value;
    const dialogRef = this.dialog.open(DialogUpdateEmployeeComponent, {
      width: "300px",
      data: { qty: employees.length, role: newRole },
    });

    console.log(newRole);
    dialogRef
      .afterClosed()
      .pipe(
        switchMap((confirmed) => {
          return confirmed ? this.employeeService.updateEmployees(employees, { role: newRole }) : of(false);
        }),
        switchMap((employeesUpdated) => {
          return employeesUpdated ? this.employeeService.findEmployeesByProject(this.projectId) : of(false);
        })
      )
      .subscribe((response) => {
        event.source.value = "";
        if (response) {
          this.assignedEmployeesSelection.clear();
          this.employees = (<{ employees: Employee[]; teams: Team[] }>response).employees;
          this.assignedEmployeesDataSource.data = this.employees;
        }
      });
  }
}
