import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthService } from "../auth.service";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.css"],
})
export class SignupComponent implements OnInit {
  isLoading: boolean = false;
  hide: boolean = true;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {}

  onSignup(form: NgForm) {
    if (form.invalid) return;
    this.authService.createUser(form.value.email, form.value.firstName, form.value.lastName, form.value.password);
  }
}
