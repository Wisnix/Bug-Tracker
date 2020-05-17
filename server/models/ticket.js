const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const ticketSchema = mongoose.Schema({
  title: { type: String },
  project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: false },
  description: { type: String },
  files: [{ type: mongoose.Schema.Types.ObjectId, ref: "Uploads" }],
  devResources: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: false }],
  raisedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
  created: { type: Date, default: Date.now },
  status: { type: String, default: "OPEN" },
});

ticketSchema.plugin(AutoIncrement, { inc_field: "number" });

module.exports = mongoose.model("Ticket", ticketSchema);
