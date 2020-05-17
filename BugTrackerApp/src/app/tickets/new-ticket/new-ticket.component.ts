import { Component, OnInit } from "@angular/core";
import { NgForm, FormGroup, FormControl, Validators, FormArray } from "@angular/forms";
import { TicketService } from "../ticket.service";

@Component({
  selector: "app-new-ticket",
  templateUrl: "./new-ticket.component.html",
  styleUrls: ["./new-ticket.component.css"],
})
export class NewTicketComponent implements OnInit {
  files = [];
  ticketForm: FormGroup;
  constructor(private ticketService: TicketService) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm() {
    this.ticketForm = new FormGroup({
      title: new FormControl("", [Validators.required]),
      project: new FormControl("", [Validators.required]),
      description: new FormControl("", [Validators.required]),
      devResources: new FormArray([
        new FormGroup({
          developer: new FormControl(""),
        }),
      ]),
      files: new FormArray([]),
    });
  }

  get controls() {
    return (<FormArray>this.ticketForm.get("devResources")).controls;
  }

  onNewTicket() {
    if (this.ticketForm.valid) this.ticketService.createTicket(this.ticketForm.value);
  }

  onAddDeveloper() {
    (<FormArray>this.ticketForm.get("devResources")).push(
      new FormGroup({
        developer: new FormControl(""),
      })
    );
  }

  onDeleteDeveloper(index: number) {
    if (index === 0) {
      (<FormArray>this.ticketForm.get("devResources")).controls[0].get("developer").setValue("");
      return;
    }
    (<FormArray>this.ticketForm.get("devResources")).removeAt(index);
  }

  onSelect(event) {
    for (let file of event.addedFiles) {
      const newFile = new FormControl({ file });
      (<FormArray>this.ticketForm.get("files")).push(newFile);
    }
    this.files.push(...event.addedFiles);
  }

  onRemove(event) {
    console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
    let formArray = <FormArray>this.ticketForm.get("files");
    formArray.clear();
    for (let file of this.files) {
      const newFile = new FormControl({ file });
      (<FormArray>this.ticketForm.get("files")).push(newFile);
    }
  }
}
