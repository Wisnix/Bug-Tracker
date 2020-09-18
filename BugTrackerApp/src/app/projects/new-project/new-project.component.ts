import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators, FormArray } from "@angular/forms";
import { ProjectService } from "../project.service";
import { EmployeeService } from "src/app/employees/employee.service";
import { Employee } from "src/app/employees/employee.model";
import { Subscription } from "rxjs";
import { SlowBuffer } from "buffer";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-new-project",
  templateUrl: "./new-project.component.html",
  styleUrls: ["./new-project.component.css"],
})
export class NewProjectComponent implements OnInit {
  employees: Employee[] = [];
  employeesSub: Subscription;
  filteredEmployees: [Employee[]] = [[]];
  assignedEmployees: [Employee[]] = [[]];
  excludedIds: string[] = [];
  projectForm: FormGroup;
  constructor(private projectService: ProjectService, private employeeService: EmployeeService, private _snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.initForm();
    this.employeesSub = this.employeeService.findEmployees("", "", "true").subscribe((employees) => {
      this.employees = employees;
      this.filteredEmployees[0] = [...employees];
    });
  }

  private initForm() {
    this.projectForm = new FormGroup({
      title: new FormControl("", [Validators.required]),
      description: new FormControl("", [Validators.required]),
      teams: new FormArray([
        new FormGroup({
          name: new FormControl(""),
          employees: new FormArray([]),
        }),
      ]),
    });
  }
  get controls() {
    return (<FormArray>this.projectForm.get("teams")).controls;
  }
  onNewProject() {
    if (this.projectForm.valid) {
      let teams = <FormArray>this.projectForm.get("teams").value;
      for (let i = 0; i < teams.length; i++) {
        if (!teams[i].name) {
          (<FormArray>this.projectForm.get("teams")).removeAt(i);
          continue;
        }
        let assignedEmployees = this.assignedEmployees[i];
        for (let j = 0; j < assignedEmployees.length; j++) {
          teams[i].employees.push({ _id: assignedEmployees[j]._id, role: assignedEmployees[j].role });
        }
      }
      this.projectService.createProject(this.projectForm.value).subscribe(({ message, project }) => {
        this._snackBar.open("Ticket created sucessfully", "", {
          duration: 2000,
          verticalPosition: "top",
          panelClass: "snackbar-success",
        });
      });
    }
  }
  onAddTeam() {
    (<FormArray>this.projectForm.get("teams")).push(
      new FormGroup({
        name: new FormControl(""),
        employees: new FormArray([]),
      })
    );
    this.assignedEmployees.push([]);
  }
  onDeleteTeam(index: number) {
    let teams = <FormArray>this.projectForm.get("teams");
    if (index === 0 && teams.length === 1) {
      teams.controls[0].get("name").setValue("");
      return;
    }
    this.assignedEmployees.splice(index, 1);
    teams.removeAt(index);
  }
  filterEmployees(value, index) {
    const filterValue = value.toLowerCase();
    this.filteredEmployees[index] = this.employeeService.filterEmployeesArray(this.employees, value);

    if (this.filteredEmployees[index].length === 0) {
      this.employeeService.findEmployees(value, this.excludedIds, "true").subscribe((employees) => {
        this.filteredEmployees[index].push(...employees);
      });
    }
  }
  onAddEmployeeToTeam(employee, teamIndex) {
    this.excludedIds.push(employee._id);
    for (let emps of this.filteredEmployees) {
      emps.splice(this.employees.indexOf(employee), 1);
    }
    employee.role = "Developer";
    this.assignedEmployees[teamIndex].push(employee);
    this.employees.splice(this.employees.indexOf(employee), 1);
  }
  onDeleteEmployeeFromTeam(employee, teamIndex, employeeIndex) {
    this.excludedIds.splice(this.excludedIds.indexOf(employee._id), 1);
    this.assignedEmployees[teamIndex].splice(employeeIndex, 1);
    for (let emps of this.filteredEmployees) {
      emps.push(employee);
    }
  }

  onExpansionPanelOpened() {
    this.filteredEmployees.push([...this.employees]);
  }
  onExpansionPanelClosed(teamIndex) {
    this.filteredEmployees.splice(teamIndex, 1);
  }
}
