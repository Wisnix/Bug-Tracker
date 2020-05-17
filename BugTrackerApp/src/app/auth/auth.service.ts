import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AuthData } from "./auth-data.model";
import { Router } from "@angular/router";
import { Timestamp } from "rxjs/internal/operators/timestamp";

@Injectable({ providedIn: "root" })
export class AuthService {
  private tokenTimer: any;
  private isAuthenticated: boolean;
  private token: string;
  constructor(private http: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }

  createUser(email: string, firstName: string, lastName: string, password: string) {
    const authData: AuthData = { email, firstName, lastName, password };
    this.http.post("http://localhost:5000/api/auth/signup", authData).subscribe((response) => {
      console.log(response);
    });
  }

  login(email: string, password: string) {
    this.http
      .post<{ token: string; expiresIn: number }>("http://localhost:5000/api/auth/login", { email, password })
      .subscribe((response) => {
        const token = response.token;
        this.token = token;

        if (token) {
          const expiresInDuration = response.expiresIn;
          this.setAuthTimer(expiresInDuration);
          this.isAuthenticated = true;
          this.router.navigate(["/"]);
          const expirationDate = new Date(new Date().getTime() + expiresInDuration * 1000);
          this.saveAuthData(token, expirationDate);
          console.log(response);
        }
      });
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

  private saveAuthData(token: string, expirationDate: Date) {
    localStorage.setItem("token", token);
    localStorage.setItem("expiration", expirationDate.toISOString());
  }

  private clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
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
      this.setAuthTimer(expiresInDuration / 1000);
    }
  }

  private getAuthData() {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    if (!token || !expirationDate) {
      return;
    }
    return {
      token,
      expirationDate: new Date(expirationDate),
    };
  }
}
