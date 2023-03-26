const mongoose = require("mongoose");

const columnSchema = new mongoose.Schema(
  {
    column_name: {
      type: String,
      required: true,
      unique: true,
    },
    serial: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Column", columnSchema);
