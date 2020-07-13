import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ProjectService } from "../project.service";
import { switchMap } from "rxjs/operators";
import { Project } from "../project.model";
import { Subject, Subscription } from "rxjs";
import { Employee } from "src/app/employee/employee.model";
import { Ticket } from "src/app/tickets/ticket.model";
import { Team } from "src/app/teams/team.model";

@Component({
  selector: "app-select-project",
  templateUrl: "./select-project.component.html",
  styleUrls: ["./select-project.component.css"],
})
export class SelectProjectComponent implements OnInit, OnDestroy {
  project: Project;
  employees: Employee[] = [];
  teams: Team[] = [];
  tickets: Ticket[] = [];
  projectSub: Subscription;
  dtTeamsOptions: DataTables.Settings = {};
  dtEmployeesOptions: DataTables.Settings = {};
  dtTicketsOptions: DataTables.Settings = {};
  dtTrigger = new Subject();
  constructor(private route: ActivatedRoute, private projectService: ProjectService) {}

  ngOnInit() {
    this.dtTeamsOptions = {
      autoWidth: false,
      info: false,
      paging: true,
      pagingType: "full_numbers",
      columns: [{ width: "25%" }, { width: "25%" }, { width: "25%" }, { width: "25%" }],
    };
    this.dtEmployeesOptions = {
      autoWidth: false,
      info: false,
      responsive: true,
      paging: true,
      pagingType: "full_numbers",
      columns: [{ width: "25%" }, { width: "25%" }, { width: "25%" }, { width: "25%" }],
    };
    this.dtTicketsOptions = {
      autoWidth: false,
      pagingType: "full_numbers",
      columns: [{ width: "20%" }, { width: "60%" }, { width: "20%" }],
    };
    this.projectSub = this.route.params.pipe(switchMap((params) => this.projectService.getProject(params.id))).subscribe(({ project, tickets }) => {
      this.project = project;
      this.employees = this.project.teams.reduce(
        (acc, cur) => acc.concat((<Employee[]>cur.employees).map((e) => ({ ...e, teamName: cur.name }))),
        []
      );
      this.tickets = tickets;
      this.teams = project.teams;
      this.dtTrigger.next();
    });
  }

  ngOnDestroy() {
    this.projectSub.unsubscribe();
  }
  test(test) {
    console.log(test);
  }
}
