import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthService } from "../auth.service";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.css"],
})
export class SignupComponent implements OnInit {
  isLoading: boolean = false;
  hide: boolean = true;
  signupError: string;
  constructor(private authService: AuthService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params.signupError) {
        this.signupError = "User with this email already exists";
      }
    });
  }

  onSignup(form: NgForm) {
    if (form.invalid) return;
    this.authService.createUser(form.value.email, form.value.firstName, form.value.lastName, form.value.password);
  }
}
