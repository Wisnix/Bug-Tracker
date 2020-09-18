import { NgModule } from "@angular/core";
import { SharedModule } from "../shared/shared.module";
import { EmployeesComponent } from "./employees.component";
import { EmployeeListComponent } from "./employee-list/employee-list.component";
import { EmployeesRoutingModule } from "./employees-routing.module";
import { EmployeesTableComponent } from "./employee-list/employees-table/employees-table.component";
import { MatPaginatorModule, MatPaginator } from "@angular/material/paginator";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatCheckboxModule, MatCheckbox } from "@angular/material/checkbox";
import { MatOptionModule, MatOption } from "@angular/material/core";
import { MatSelectModule, MatSelect } from "@angular/material/select";
import { MatCard, MatCardModule } from "@angular/material/card";
import { NgxMatSelectSearchModule } from "ngx-mat-select-search";
import { MatFormFieldModule } from "@angular/material/form-field";
import { DataTablesModule } from "angular-datatables";
import { MatTableModule } from "@angular/material/table";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";

@NgModule({
  declarations: [EmployeesComponent, EmployeeListComponent, EmployeesTableComponent],
  imports: [
    SharedModule,
    MatTableModule,
    DataTablesModule,
    EmployeesRoutingModule,
    MatPaginatorModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    FormsModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatSelectModule,
    NgxMatSelectSearchModule,
  ],
})
export class EmployeesModule {}
