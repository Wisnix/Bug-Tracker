import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "app-dialog-update-employee",
  templateUrl: "./dialog-update-employee.component.html",
  styleUrls: ["./dialog-update-employee.component.css"],
})
export class DialogUpdateEmployeeComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<DialogUpdateEmployeeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { qty: number; team: string; role: string }
  ) {}

  ngOnInit(): void {}
}
