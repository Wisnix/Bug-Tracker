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
import { MatTableModule } from "@angular/material/table";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatDialogModule } from "@angular/material/dialog";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { ConfirmDialogComponent } from "./confirm-dialog/confirm-dialog.component";

@NgModule({
  declarations: [TimeAgoExtendsPipe, HistoryTitlePipe, ConfirmDialogComponent],
  imports: [CommonModule, MatDialogModule],
  exports: [CommonModule, TimeAgoExtendsPipe, HistoryTitlePipe, MatButtonModule, MatDialogModule, MatSnackBarModule],
})
export class SharedModule {}
