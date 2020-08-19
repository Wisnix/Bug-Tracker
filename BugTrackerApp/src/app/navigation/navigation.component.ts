import { Component, OnInit } from "@angular/core";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { Observable } from "rxjs";
import { map, shareReplay } from "rxjs/operators";
import { AuthService } from "../auth/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-navigation",
  templateUrl: "./navigation.component.html",
  styleUrls: ["./navigation.component.css"],
})
export class NavigationComponent implements OnInit {
  isAdmin: boolean = false;
  userName: string;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map((result) => result.matches),
    shareReplay()
  );

  constructor(private breakpointObserver: BreakpointObserver, private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.userName = this.authService.loggedEmployee.firstName;
    this.isAdmin = this.authService.isAdmin();
  }

  onMyProject() {
    const projectId = this.authService.getProjectId();
    if (projectId) {
      this.router.navigate(["/projects", projectId]);
    } else {
      this.router.navigate(["/projects", "unassigned"]);
    }
  }

  onLogout() {
    this.authService.logout();
  }

  onNewTicket() {
    this.router.navigate(["/tickets/new"]);
  }
}
