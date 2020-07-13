import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TimeAgoExtendsPipe } from "./pipes/time-ago-extends.pipe";
import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DataTablesModule } from "angular-datatables";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { MatSelectModule } from "@angular/material/select";
import { NgxMatSelectSearchModule } from "ngx-mat-select-search";
import { HistoryTitlePipe } from "./pipes/history-title.pipe";

@NgModule({
  declarations: [TimeAgoExtendsPipe, HistoryTitlePipe],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    MatSelectModule,
    NgxMatSelectSearchModule,
  ],
  exports: [
    CommonModule,
    TimeAgoExtendsPipe,
    HistoryTitlePipe,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    MatSelectModule,
    NgxMatSelectSearchModule,
  ],
})
export class SharedModule {}
