import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthService } from "../auth.service";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  isLoading: boolean = false;
  loginError: string;
  signupMessage: string;

  constructor(private authService: AuthService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params.loginError) {
        this.loginError = "Wrong username or password.";
      }
      if (params.signup) {
        console.log("dupa");
        this.signupMessage = "User successfully created.";
      }
    });
  }

  onLogin(form: NgForm) {
    if (form.invalid) return;
    this.isLoading = true;
    this.authService.login(form.value.email, form.value.password);
    this.isLoading = false;
  }
}
