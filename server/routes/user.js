const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Team = require("../models/team");
const async = require("async");
const checkAuth = require("../middleware/check-auth");

// router.get("/:project", checkAuth, (req, res, next) => {
//   console.log(req.body);
// });

router.get("/", checkAuth, (req, res, next) => {
  const searchQuery = req.query.searchQuery;
  const excludedIds = req.query.excludedIds;
  const unassigned = req.query.unassigned;
  let query = {};
  let limit = 100;
  if (searchQuery) {
    const regex = new RegExp(searchQuery);
    const splittedSearchQuery = searchQuery.split(" ");
    const firstPart = new RegExp(splittedSearchQuery[0]);
    const secondPart = new RegExp(splittedSearchQuery[1]);
    query = {
      $or: [
        { firstName: regex },
        { lastName: regex },
        { email: regex },
        { firstName: firstPart, lastName: secondPart },
        { firstName: secondPart, lastName: firstPart },
      ],
      _id: { $ne: excludedIds },
    };
    limit = 0;
  }
  if (unassigned === "true") {
    query["team"] = null;
  }
  User.find(query, "_id firstName lastName email role")
    .limit(limit)
    .then((employees) => {
      if (employees) {
        res.status(201).json(employees);
      } else {
        res.status(500).json({ message: "No employees have been found" });
      }
    });
});

router.patch("/", checkAuth, (req, res, next) => {
  const employees = [];
  const updateQuery = req.body.update;
  const oldTeamsToUpdate = {};
  for (let employee of req.body.employees) {
    employees.push(employee._id);
    if ((updateQuery.team || updateQuery.$unset) && employee.team) {
      if (!oldTeamsToUpdate[employee.team]) oldTeamsToUpdate[employee.team] = [];
      oldTeamsToUpdate[employee.team].push(employee._id);
    }
  }
  User.updateMany({ _id: { $in: employees } }, updateQuery)
    .then((updatedEmployees) => {
      async.eachOfSeries(
        oldTeamsToUpdate,
        (employeesToMove, team, done) => {
          if (team !== "undefined" || updateQuery.$unset) Team.updateOne({ _id: team }, { $pull: { employees: { $in: employeesToMove } } }).exec();
          done();
        },
        (error) => {
          if (error) throw error;
        }
      );
      if (updateQuery.team) return Team.updateOne({ _id: updateQuery.team }, { $push: { employees: { $each: employees } } }).exec();
    })
    .then(() => {
      res.status(200).json({ message: "Employees updated successfully." });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json(error);
    });
});

module.exports = router;
