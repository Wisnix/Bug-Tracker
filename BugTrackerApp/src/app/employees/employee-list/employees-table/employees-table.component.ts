import { Component, OnInit, ViewChild, Input, OnDestroy, OnChanges, Output, EventEmitter } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { Employee } from "../../employee.model";
import { SelectionModel } from "@angular/cdk/collections";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { Team } from "src/app/teams/team.model";
import { EmployeeService } from "../../employee.service";
import { MatDialog } from "@angular/material/dialog";
import { switchMap } from "rxjs/operators";
import { of, BehaviorSubject, Subscription } from "rxjs";
import { ConfirmDialogComponent } from "src/app/shared/confirm-dialog/confirm-dialog.component";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-employees-table",
  templateUrl: "./employees-table.component.html",
  styleUrls: ["./employees-table.component.css"],
})
export class EmployeesTableComponent implements OnInit, OnDestroy {
  employeesSub: Subscription;
  _employees = new BehaviorSubject<Employee[]>([]);
  @Input() set employees(value: Employee[]) {
    this._employees.next(value);
  }
  @Input() teams: Team[];
  @Input() showUnassignOption: boolean;
  @Output() assignEmployees = new EventEmitter<Employee[]>();
  @Output() unassignEmployees = new EventEmitter<Employee[]>();
  roles: string[] = ["Developer", "Tester", "Project Manager"];
  displayedColumns: string[] = ["select", "email", "firstName", "lastName", "teamName", "role"];
  dataSource = new MatTableDataSource<Employee>();
  selection = new SelectionModel<Employee>(true, []);
  selectedRows: number[] = [];

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private employeeService: EmployeeService, public dialog: MatDialog, private _snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.employeesSub = this._employees.subscribe((employees) => {
      this.dataSource.data = employees;
    });
  }
  ngOnDestroy() {
    this.employeesSub.unsubscribe();
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      this.selectedRows = [];
    } else {
      this.selectedRows = [];
      this.dataSource.data.forEach((row, i) => {
        this.selectedRows.push(i);
        this.selection.select(row);
      });
    }
  }
  checkboxLabel(row?: Employee): string {
    if (!row) {
      return `${this.isAllSelected() ? "select" : "deselect"} all`;
    }
    return `${this.selection.isSelected(row) ? "deselect" : "select"} row ${row.email + 1}`;
  }
  applyFilter(event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  updateEmployees(event, updateType) {
    const employees = this.selection.selected;
    const newValue = event.value;
    let data = { message: "" };
    let updateQuery = {};
    this.updateQuery(updateQuery, data, updateType, newValue);

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: "300px",
      data,
    });
    dialogRef
      .afterClosed()
      .pipe(
        switchMap((confirmed) => {
          return confirmed ? this.employeeService.updateEmployees(employees, updateQuery) : of(false);
        })
      )
      .subscribe((response) => {
        event.source.value = "";
        console.log(response);
        if (response) {
          let assignedEmployees = [];
          let unassignedEmployees = [];
          this.updateTable(assignedEmployees, unassignedEmployees, updateType, newValue);
          if (assignedEmployees.length) this.assignEmployees.emit(assignedEmployees);
          if (unassignedEmployees.length) this.unassignEmployees.emit(unassignedEmployees);
          this._snackBar.open("Employees updated ", "", {
            duration: 2000,
            verticalPosition: "top",
            panelClass: "snackbar-success",
          });
        }
      });
  }
  private updateQuery(updateQuery: any, data: any, updateType: string, newValue: any) {
    const qty = this.selection.selected.length;
    if (updateType === "role") {
      data.message = `Are you sure you want to change the role of ${qty} employees to ${newValue}?`;
      updateQuery["role"] = newValue;
    } else if (updateType === "team" && !newValue._id) {
      data.message = `Are you sure you want to unassign ${qty} ${qty > 1 ? "employees" : "employee"}?`;
      updateQuery["$unset"] = { team: "" };
    } else if (updateType === "team") {
      data.message = `Are you sute you want to move ${qty} employees to Team ${newValue.name}?`;
      updateQuery["team"] = newValue._id;
    }
  }
  private updateTable(assignedEmployees: Employee[], unassignedEmployees: Employee[], updateType: string, newValue: any) {
    let refresh: boolean = false;
    for (let i = this.selectedRows.length - 1; i >= 0; i--) {
      let row = this.dataSource.data[this.selectedRows[i]];
      if (updateType === "role") {
        row.role = newValue;
      } else if (updateType === "team" && !row.team) {
        //move unassigned employee to assigned list
        row.teamName = newValue.name;
        row.team = newValue._id;
        assignedEmployees.push(row);
        this.dataSource.data.splice(i, 1);
        refresh = true;
      } else if (updateType === "team" && !newValue._id) {
        //unassign employee
        row.teamName = "";
        row.team = null;
        unassignedEmployees.push(row);
        this.dataSource.data.splice(i, 1);
        refresh = true;
      } else if (updateType === "team") {
        //change team of assigned employee
        row.teamName = newValue.name;
        row.team = newValue._id;
      }
    }
    if (refresh) this.employees = this.dataSource.data;
    this.selectedRows = [];
    this.selection.clear();
  }
  toggleSelection(row, i) {
    let index = i + this.paginator.pageSize * this.paginator.pageIndex;
    if (!this.selection.isSelected(row)) {
      this.selectedRows.push(index);
    } else {
      this.selectedRows.splice(this.selectedRows.indexOf(index), 1);
    }
    this.selection.toggle(row);
  }
  dupa() {
    // console.log(this.paginator.pageIndex);
    // console.log(this.selectedRows.length);
  }
}
