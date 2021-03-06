import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { LayoutModule } from "@angular/cdk/layout";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatButtonModule } from "@angular/material/button";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { NavigationComponent } from "./navigation/navigation.component";
import { LoginComponent } from "./auth/login/login.component";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MainComponent } from "./main/main.component";
import { SignupComponent } from "./auth/signup/signup.component";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { AuthInterceptor } from "./auth/auth-interceptor";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { TicketsModule } from "./tickets/tickets.module";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatCardModule } from "@angular/material/card";
import { MatMenuModule } from "@angular/material/menu";
import { ProjectsModule } from "./projects/projects.module";
import { ChartModule } from "angular2-chartjs";
import { HasRoleDirective } from "./shared/directives/has-role.directive";
import { SettingsComponent } from "./settings/settings.component";

@NgModule({
  declarations: [
    AppComponent,
    HasRoleDirective,
    NavigationComponent,
    LoginComponent,
    MainComponent,
    SignupComponent,
    DashboardComponent,
    SettingsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    TicketsModule,
    BrowserAnimationsModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    ProjectsModule,
    MatCardModule,
    MatMenuModule,
    ChartModule,
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }],
  bootstrap: [AppComponent],
})
export class AppModule {}
