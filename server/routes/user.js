const express = require("express");
const router = express.Router();
const User = require("../models/user");
const checkAuth = require("../middleware/check-auth");

// router.get("/:project", checkAuth, (req, res, next) => {
//   console.log(req.body);
// });

router.get("/", checkAuth, (req, res, next) => {
  const searchQuery = req.query.searchQuery;
  const excludedIds = req.query.excludedIds;
  const query = {};
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
  User.find(query, "_id firstName lastName email")
    .limit(limit)
    .then((employees) => {
      if (employees) {
        res.status(201).json(employees);
      } else {
        res.status(500).json({ message: "No employees have been found" });
      }
    });
});

// router.get("/test/test", (req, res, next) => {
//   const users = [];
//   for (let i = 0; i < 500; i++) {
//     users.push(new User({ firstName: "john", lastName: "Smith", email: "johnsmith@gmail.com" + i, password: "asarsrwasdwasdw" }));
//   }
//   console.log("start");
//   User.insertMany(users).then((e) => {
//     console.log("done");
//   });
// });

module.exports = router;
