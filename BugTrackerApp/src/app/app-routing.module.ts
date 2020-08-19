import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LoginComponent } from "./auth/login/login.component";
import { MainComponent } from "./main/main.component";
import { SignupComponent } from "./auth/signup/signup.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { AuthGuard } from "./auth/auth.guard";

const routes: Routes = [
  { path: "login", component: LoginComponent },
  { path: "signup", component: SignupComponent },
  {
    path: "",
    component: MainComponent,
    children: [
      {
        path: "tickets",
        loadChildren: () => import("./tickets/tickets.module").then((m) => m.TicketsModule),
        canActivate: [AuthGuard],
        canLoad: [AuthGuard],
        data: { roles: ["all"] },
      },
      {
        path: "projects",
        loadChildren: () => import("./projects/projects.module").then((m) => m.ProjectsModule),
        // canActivate: [AuthGuard],
        // canLoad: [AuthGuard],
        // data: { roles: ["admin", "project manager"] },
      },
      {
        path: "teams",
        loadChildren: () => import("./teams/teams.module").then((m) => m.TeamsModule),
        // canActivate: [AuthGuard],
        // canLoad: [AuthGuard],
        // data: { roles: ["project manager"] },
      },
      {
        path: "employees",
        loadChildren: () => import("./employees/employees.module").then((m) => m.EmployeesModule),
        // canActivate: [AuthGuard],
        // canLoad: [AuthGuard],
        // data: { roles: ["project manger"] },
      },
      {
        path: "dashboard",
        component: DashboardComponent,
        canActivate: [AuthGuard],
        canLoad: [AuthGuard],
        data: { roles: ["project manager"] },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
