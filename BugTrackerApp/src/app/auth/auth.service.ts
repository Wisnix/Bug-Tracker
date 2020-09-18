import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AuthData } from "./auth-data.model";
import { Router } from "@angular/router";
import { Timestamp } from "rxjs/internal/operators/timestamp";
import { Project } from "../projects/project.model";
import { Employee } from "../employees/employee.model";
import { Subject } from "rxjs";

@Injectable({ providedIn: "root" })
export class AuthService {
  private tokenTimer: any;
  private isAuthenticated: boolean;
  loggedEmployee: Employee;
  loggedEmployeeUpdated = new Subject<Employee>();
  private token: string;
  constructor(private http: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }

  createUser(email: string, firstName: string, lastName: string, password: string) {
    const authData: AuthData = { email, firstName, lastName, password };
    this.http.post("http://localhost:5000/api/auth/signup", authData).subscribe(
      (response) => {
        if (response) this.router.navigate(["/login"], { queryParams: { signup: true } });
      },
      (err) => {
        this.router.navigate(["/signup"], { queryParams: { signupError: true } });
      }
    );
  }

  login(email: string, password: string) {
    this.http
      .post<{ token: string; expiresIn: number; user: Employee }>("http://localhost:5000/api/auth/login", { email, password })
      .subscribe(
        (response) => {
          const token = response.token;
          this.token = token;
          console.log("dupa");
          if (token) {
            const expiresInDuration = response.expiresIn;
            this.setAuthTimer(expiresInDuration);
            this.isAuthenticated = true;
            this.loggedEmployee = response.user;
            this.router.navigate(["/"]);
            const expirationDate = new Date(new Date().getTime() + expiresInDuration * 1000);
            this.saveAuthData(token, expirationDate, this.loggedEmployee);
          }
        },
        (err) => {
          this.router.navigate(["/login"], { queryParams: { loginError: true } });
        }
      );
  }

  private setAuthTimer(expiresInDuration: number) {
    console.log("setting timer to " + expiresInDuration);
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, expiresInDuration * 1000);
  }

  logout() {
    clearTimeout(this.tokenTimer);
    this.token = null;
    this.isAuthenticated = false;
    console.log(this.token);
    this.router.navigate(["/login"]);
    this.clearAuthData();
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getProjectId() {
    return this.loggedEmployee.team?.project._id;
  }

  hasRole(role: string) {
    return this.isAuthenticated && this.loggedEmployee.role.toLowerCase() === role.toLowerCase();
  }

  isAdmin() {
    return this.isAuthenticated && this.loggedEmployee.role.toLowerCase() === "admin";
  }

  private saveAuthData(token: string, expirationDate: Date, employee: Employee) {
    localStorage.setItem("token", token);
    localStorage.setItem("expiration", expirationDate.toISOString());
    localStorage.setItem("loggedEmployee", JSON.stringify(employee));
  }

  private clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    localStorage.removeItem("loggedEmployee");
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresInDuration = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresInDuration > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.loggedEmployee = authInformation.employee;
      this.setAuthTimer(expiresInDuration / 1000);
    }
  }

  private getAuthData() {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    const employee = JSON.parse(localStorage.getItem("loggedEmployee"));
    if (!token || !expirationDate) {
      return;
    }
    return {
      token,
      expirationDate: new Date(expirationDate),
      employee,
    };
  }

  updateLoggedEmployee(employee: Employee) {
    localStorage.setItem("loggedEmployee", JSON.stringify(employee));
    this.loggedEmployee = employee;
    this.loggedEmployeeUpdated.next(employee);
  }
}
