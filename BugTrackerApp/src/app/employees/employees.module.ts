import { NgModule } from "@angular/core";
import { SharedModule } from "../shared/shared.module";
import { EmployeesComponent } from "./employees.component";
import { EmployeeListComponent } from "./employee-list/employee-list.component";
import { EmployeesRoutingModule } from "./employees-routing.module";
import { DialogUpdateEmployeeComponent } from './employee-list/dialog-update-employee/dialog-update-employee.component';

@NgModule({ declarations: [EmployeesComponent, EmployeeListComponent, DialogUpdateEmployeeComponent], imports: [SharedModule, EmployeesRoutingModule] })
export class EmployeesModule {}
