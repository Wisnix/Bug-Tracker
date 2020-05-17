const express = require("express");
const crypto = require("crypto");
const path = require("path");
const router = express.Router();
const mongoose = require("mongoose");
const Grid = require("gridfs-stream");
const GridFsStorage = require("multer-gridfs-storage");
const mongoURI = "mongodb://localhost:27017/bug_tracker";
const multer = require("multer");
const Ticket = require("../models/ticket");
const checkAuth = require("../middleware/check-auth");

// INIT GFS
let gfs;
mongoose.connection.once("open", () => {
  gfs = Grid(mongoose.connection.db, mongoose.mongo);
  gfs.collection("uploads");
});
const storage = new GridFsStorage({
  url: mongoURI,
  options: { useUnifiedTopology: true },
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          console.log(err);
          return reject(err);
        }
        const filename = buf.toString("hex") + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: "uploads",
        };
        resolve(fileInfo);
      });
    });
  },
});
const upload = multer({ storage: storage });

//ROUTES
router.get("/", checkAuth, (req, res, next) => {
  Ticket.find().then((tickets) => {
    if (tickets) {
      res.status(200).json(tickets);
    } else {
      res.status(404).json({ message: "Tickets not found." });
    }
  });
});

router.post("/", upload.array("files"), (req, res) => {
  const files = [];
  for (let file of req.files) {
    files.push(file.id);
  }
  // const devResources = [...JSON.parse(req.body.devResources)];
  const ticket = new Ticket({
    title: req.body.title,
    description: req.body.description,
    // devResources,
    files,
  });

  ticket
    .save()
    .then((ticket) => {
      res.status(201).json({ message: "Ticket created successfully", ticket: ticket });
    })
    .catch((error) => {
      res.status(500).json({ error });
      console.log(error);
    });
});

module.exports = router;
