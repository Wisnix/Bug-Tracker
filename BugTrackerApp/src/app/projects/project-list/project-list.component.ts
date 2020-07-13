import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subject, Subscription } from "rxjs";
import { Project } from "../project.model";
import { ProjectService } from "../project.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-project-list",
  templateUrl: "./project-list.component.html",
  styleUrls: ["./project-list.component.css"],
})
export class ProjectListComponent implements OnInit, OnDestroy {
  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject();
  projects: Project[] = [];
  projectsSub: Subscription;
  constructor(private projectService: ProjectService, private router: Router) {}

  ngOnInit(): void {
    //table options
    this.dtOptions = {
      autoWidth: false,
      pagingType: "full_numbers",
      columns: [{ width: "50%" }, { width: "20%" }, { width: "30%" }],
    };
    //fetch projects
    this.projectsSub = this.projectService.getProjects().subscribe((projects) => {
      this.projects = projects;
      this.dtTrigger.next();
    });
  }

  ngOnDestroy() {
    this.projectsSub.unsubscribe();
  }

  onNewProject() {
    this.router.navigate(["/projects/new"]);
  }
}
