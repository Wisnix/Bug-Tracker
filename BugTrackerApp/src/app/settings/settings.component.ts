import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, RequiredValidator, Validators } from "@angular/forms";
import { EmployeeService } from "../employees/employee.service";
import { AuthService } from "../auth/auth.service";
import { Employee } from "../employees/employee.model";
import { Subscription } from "rxjs";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.css"],
})
export class SettingsComponent implements OnInit {
  passwordsInvalid: boolean = false;
  employee: Employee;
  employeeSub: Subscription;
  changePassword: boolean = false;
  changeDetails: boolean = false;
  detailsForm: FormGroup;
  passwordForm: FormGroup;
  constructor(private employeeService: EmployeeService, private authService: AuthService, private _snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.employee = this.authService.loggedEmployee;
    this.detailsForm = new FormGroup({
      firstName: new FormControl({ value: this.employee.firstName, disabled: true }),
      lastName: new FormControl({ value: this.employee.lastName, disabled: true }),
      email: new FormControl({ value: this.employee.email, disabled: true }),
    });
    this.passwordForm = new FormGroup(
      {
        password: new FormControl("", [Validators.required]),
        retypePassword: new FormControl("", [Validators.required]),
      },
      this.passwordMatchValidator
    );
    this.employeeSub = this.authService.loggedEmployeeUpdated.subscribe((employee) => {
      this.employee = employee;
    });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get("password").value === g.get("retypePassword").value ? null : { mismatch: true };
  }

  onEditPassword() {
    this.changePassword = !this.changePassword;
  }

  onEditDetails() {
    this.changeDetails = !this.changeDetails;
    if (this.changeDetails) this.detailsForm.enable();
    else this.detailsForm.disable();
  }

  onSubmitDetails() {
    if (this.detailsForm.valid) {
      this.employeeService.updateEmployee(this.employee._id, this.detailsForm.value).subscribe((employee) => {
        this.authService.updateLoggedEmployee(employee);
        this.detailsForm.disable();
        this._snackBar.open(`Your account has been updated`, "", {
          duration: 2000,
          verticalPosition: "top",
          panelClass: "snackbar-success",
        });
        this.changeDetails = false;
      });
    }
  }

  onSubmitPassword() {
    if (this.passwordForm.valid) {
      this.passwordsInvalid = false;
      this.employeeService.updateEmployee(this.employee._id, { password: this.passwordForm.value.password }).subscribe((employee) => {
        this.changePassword = false;
        this._snackBar.open(`Your password has been updated`, "", {
          duration: 2000,
          verticalPosition: "top",
          panelClass: "snackbar-success",
        });
      });
    } else {
      this.passwordsInvalid = true;
    }
  }
}
