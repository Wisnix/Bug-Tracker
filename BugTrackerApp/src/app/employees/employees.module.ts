import { NgModule } from "@angular/core";
import { SharedModule } from "../shared/shared.module";
import { EmployeesComponent } from "./employees.component";
import { EmployeeListComponent } from "./employee-list/employee-list.component";
import { EmployeesRoutingModule } from "./employees-routing.module";
import { EmployeesTableComponent } from "./employee-list/employees-table/employees-table.component";

@NgModule({
  declarations: [EmployeesComponent, EmployeeListComponent, EmployeesTableComponent],
  imports: [SharedModule, EmployeesRoutingModule],
})
export class EmployeesModule {}
