const express = require("express");
const router = express.Router();

//importing the order controllers
const {
  getAllColumns,
  addNewColumn,
  editColumn,
  deleteColumn,
  getDetailsColumn,
} = require("../controllers/column");

router.route("/").get(getAllColumns);
router.route("/add").post(addNewColumn);
router.route("/edit").put(editColumn);
router.route("/delete").post(deleteColumn);
router.route("/details/:id").get(getDetailsColumn);

module.exports = router;
