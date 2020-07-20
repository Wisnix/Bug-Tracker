const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");
const mongoose = require("mongoose");
const Project = require("../models/project");
const Team = require("../models/team");
const Ticket = require("../models/ticket");
const Employee = require("../models/user");
const async = require("async");

router.get("/:id", checkAuth, (req, res, next) => {
  const id = req.params.id;
  let project = {};
  Project.findById(id)
    .populate({ path: "teams", populate: { path: "employees", select: "_id firstName lastName role email" } })
    .then((foundProject) => {
      if (foundProject) {
        project = foundProject;
        return Ticket.find({ project });
      } else {
        res.status(404).json({ message: "Project not found" });
      }
    })
    .then((tickets) => {
      res.status(200).json({ project, tickets });
    });
});

router.get("/:id/employees", checkAuth, (req, res, next) => {
  const id = req.params.id;
  Team.find({ project: id })
    .populate("employees", "-password")
    .then((teams) => {
      let employees = teams.flatMap((team) => team.employees.map((employee) => ({ ...employee.toObject(), teamName: team.name })));
      res.status(200).json({ employees, teams });
    });
});

router.get("/", checkAuth, (req, res, next) => {
  Project.find().then((projects) => {
    if (projects) {
      res.status(201).json(projects);
    } else {
      res.status(404).json({ message: "Projects not found" });
    }
  });
});

//NEW PROJECT
router.post("/", checkAuth, (req, res, next) => {
  const teams = [];
  for (let team of req.body.project.teams) {
    teams.push(new Team(team));
  }
  const project = new Project({
    title: req.body.project.title,
    description: req.body.project.description,
    teams,
  });
  project
    .save()
    .then((savedProject) => {
      if (req.body.project.teams.length) {
        for (let team of teams) {
          team.project = project._id;
        }
        return Team.insertMany(teams);
      } else {
        res.status(201).json({ message: "Project created successfully.", project: project });
      }
    })
    .then((insertedTeams) => {
      if (insertedTeams) {
        async.eachSeries(
          insertedTeams,
          (team, done) => {
            Employee.updateMany({ _id: { $in: team.employees } }, { team: team._id }).exec();
            done();
          },
          (error) => {
            if (error) throw error;
          }
        );
        const employees = [];
        for (let i = 0; i < req.body.project.teams.length; i++) {
          employees.push(...req.body.project.teams[i].employees);
        }
        if (employees) {
          return employees;
        } else {
          res.status(201).json({ message: "Project and teams created successfully.", project: project });
        }
      }
    })
    .then((employees) => {
      if (employees) {
        async.eachSeries(
          employees,
          (employee, done) => {
            Employee.findByIdAndUpdate(employee._id, { role: employee.role }).exec();
            done();
          },
          (error) => {
            if (error) throw error;
          }
        );
        res.status(201).json({ message: "Project and teams created successfully, employees updated successfully.", project: project });
      }
    })
    .catch((error) => {
      res.status(500).json({ message: "Something went wrong.", error });
      console.log(error);
    });
});

module.exports = router;
