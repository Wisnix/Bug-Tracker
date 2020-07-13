import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({ providedIn: "root" })
export class UserService {
  constructor(private http: HttpClient) {}

  getProjectUsers(project: string) {
    //this.http.get("http://localhost:5000/api/users/autocomplete");
  }
}
