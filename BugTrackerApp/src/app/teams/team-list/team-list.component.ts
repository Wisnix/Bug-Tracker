import { Component, OnInit, OnDestroy } from "@angular/core";
import { Team } from "../team.model";
import { Subject, Subscription } from "rxjs";
import { AuthService } from "src/app/auth/auth.service";
import { TeamService } from "../team.service";
import { FormControl, Validators } from "@angular/forms";

@Component({
  selector: "app-team-list",
  templateUrl: "./team-list.component.html",
  styleUrls: ["./team-list.component.css"],
})
export class TeamListComponent implements OnInit, OnDestroy {
  newTeam: boolean = false;
  teams: Team[];
  dtTrigger = new Subject();
  dtOptions: DataTables.Settings = {};
  projectId: string;
  teamsSub: Subscription;
  teamName: string = "";

  constructor(private authService: AuthService, private teamService: TeamService) {}

  ngOnInit(): void {
    this.dtOptions = {
      autoWidth: false,
      pagingType: "full_numbers",
    };
    this.projectId = this.authService.loggedEmployee.team.project._id;
    this.teamsSub = this.teamService.getTeams(this.projectId).subscribe((teams) => {
      this.teams = teams;
      this.dtTrigger.next();
    });
  }
  ngOnDestroy() {
    this.teamsSub.unsubscribe();
  }

  onNewTeam() {
    if (this.teamName) {
      this.teamService.createTeam(this.teamName, this.projectId).subscribe((team) => {
        this.newTeam = !this.newTeam;
        this.teamName = "";
        this.teams.push(team);
      });
    }
  }
}
