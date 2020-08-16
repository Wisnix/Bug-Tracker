import { Component, OnInit } from "@angular/core";
import { ProjectService } from "../projects/project.service";
import { AuthService } from "../auth/auth.service";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
})
export class DashboardComponent implements OnInit {
  isLoading: boolean = true;
  ticketsByPriority = {
    labels: [],
    datasets: [{ label: "Tickets by priority", data: [], backgroundColor: ["#f09188", "#e3301e", "#5d130b"] }],
  };
  ticketsByStatus = {
    labels: [],
    datasets: [{ label: "Tickets by status", data: [], backgroundColor: ["#2ecc71", "#e67e22", "#f1c40f"] }],
  };
  ticketsByTeam = {
    labels: [],
    datasets: [{ label: "Tickets by team", data: [], backgroundColor: [] }],
  };
  ticketsByType = {
    labels: [],
    datasets: [{ label: "Tickets by type", data: [], backgroundColor: [] }],
  };
  ticketsByDateOpen = { labels: [], datasets: [{ label: "Open tickets", data: [], borderColor: "#ec404f", backgroundColor: "#eee" }] };
  ticketsByDateClosed = { labels: [], datasets: [{ label: "Closed", data: [], borderColor: "#ec404f", backgroundColor: "#eee" }] };
  priorityOptions = {
    title: { display: true, text: "Tickets by priority" },
    legend: { display: false },
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
            precision: 0,
          },
        },
      ],
    },
  };
  statusOptions = {
    title: { display: true, text: "Tickets by status" },
    legend: { display: false },
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
            precision: 0,
          },
        },
      ],
    },
  };
  teamOptions = { title: { display: true, text: "Tickets by team" } };
  typeOptions = { title: { display: true, text: "Tickets by type" } };
  openOptions = {
    title: { display: true, text: "Open tickets" },
    legend: { display: false },
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
            precision: 0,
          },
        },
      ],
    },
    xAxes: [
      {
        type: "time",
        position: "bottom",
        time: {
          displayFormats: { day: "MM/YY" },
          tooltipFormat: "DD/MM/YY",
          unit: "month",
        },
      },
    ],
  };
  closedOptions = {
    title: { display: true, text: "Closed tickets this month" },
    legend: { display: false },
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
            precision: 0,
          },
        },
      ],
    },
    xAxes: [
      {
        type: "time",
        position: "bottom",
        time: {
          displayFormats: { day: "MM/YY" },
          tooltipFormat: "DD/MM/YY",
          unit: "month",
        },
      },
    ],
  };

  constructor(private projectService: ProjectService, private authService: AuthService) {}

  ngOnInit(): void {
    const id = this.authService.loggedEmployee.team.project._id;
    this.projectService.getProjectStatistics(id).subscribe((statistics) => {
      this.createCharts(statistics);
    });
  }
  private createCharts(statistics: any) {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const priority = statistics.categorizedByPriority;
    const status = statistics.categorizedByStatus;
    const team = statistics.categorizedByTeam;
    const type = statistics.categorizedByType;
    const dateOpen = statistics.categorizedByDateOpen;
    const dateClosed = statistics.categorizedByDateClosed;

    for (let e of priority) {
      this.ticketsByPriority.labels.push(e._id);
      this.ticketsByPriority.datasets[0].data.push(e.count);
    }
    for (let e of status) {
      this.ticketsByStatus.labels.push(e._id);
      this.ticketsByStatus.datasets[0].data.push(e.count);
    }
    for (let e of team) {
      this.ticketsByTeam.labels.push(e._id.name);
      this.ticketsByTeam.datasets[0].data.push(e.count);
      this.ticketsByTeam.datasets[0].backgroundColor.push(this.randomColor());
    }
    for (let e of type) {
      this.ticketsByType.labels.push(e._id);
      this.ticketsByType.datasets[0].data.push(e.count);
      this.ticketsByType.datasets[0].backgroundColor.push(this.randomColor());
    }
    for (let e of dateOpen) {
      const month = months[e._id.month - 1];
      this.ticketsByDateOpen.labels.push(month + " " + e._id.day);
      this.ticketsByDateOpen.datasets[0].data.push(e.count);
    }
    for (let e of dateClosed) {
      const month = months[e._id.month - 1];
      this.ticketsByDateClosed.labels.push(month + " " + e._id.day);
      this.ticketsByDateClosed.datasets[0].data.push(e.count);
    }
    this.isLoading = false;
  }

  private randomColor() {
    return "#" + Math.floor(Math.random() * 16777215).toString(16);
  }
}
