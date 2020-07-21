import { Component, OnInit, OnDestroy } from "@angular/core";
import { Team } from "../team.model";
import { Subject, Subscription, of } from "rxjs";
import { AuthService } from "src/app/auth/auth.service";
import { TeamService } from "../team.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatDialog } from "@angular/material/dialog";
import { ConfirmDialogComponent } from "src/app/shared/confirm-dialog/confirm-dialog.component";
import { switchMap } from "rxjs/operators";

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

  constructor(private authService: AuthService, private teamService: TeamService, private _snackBar: MatSnackBar, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.dtOptions = {
      autoWidth: false,
      pagingType: "full_numbers",
    };
    this.projectId = this.authService.loggedEmployee.team?.project._id;
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

  onDeleteTeam(team: Team) {
    if (team.openTickets && team.openTickets > 0) {
      this._snackBar.open("You cannot delete team with open tickets.", "", {
        duration: 2000,
        verticalPosition: "top",
        panelClass: "snackbar-warning",
      });
    } else {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: "300px",
        data: { message: `Are you sure you want to delete team ${team.name}?` },
      });
      dialogRef
        .afterClosed()
        .pipe(
          switchMap((confirmed) => {
            return confirmed ? this.teamService.deleteTeam(team._id) : of(false);
          })
        )
        .subscribe((response) => {
          if (response) {
            this._snackBar.open("Team deleted.", "", {
              duration: 2000,
              verticalPosition: "top",
              panelClass: "snackbar-success",
            });
            this.teams.splice(
              this.teams.findIndex((t) => t._id === team._id),
              1
            );
          }
        });
    }
  }
}
