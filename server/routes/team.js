const mongoose = require("mongoose");
const checkAuth = require("../middleware/check-auth");
const Team = require("../models/team");
const Employee = require("../models/user");
const express = require("express");
const router = express.Router();

router.get("/", checkAuth, (req, res, next) => {
  let query = {};
  const projectId = req.query.projectId;
  if (projectId) {
    query.project = projectId;
  }
  Team.find(query)
    .then((teams) => {
      if (teams) {
        res.status(201).json(teams);
      }
    })
    .catch((error) => {
      res.status(500).json({ message: "An error has occurred.", error });
    });
});

router.get("/:id/employees", checkAuth, (req, res, next) => {
  const teamId = req.params.id;
  Employee.find({ team: teamId }, "_id firstName lastName email")
    .then((employees) => {
      if (employees) {
        res.status(201).json(employees);
      }
    })
    .catch((error) => {
      res.status(500).json({ message: "An error has occurred.", error });
    });
});

module.exports = router;
