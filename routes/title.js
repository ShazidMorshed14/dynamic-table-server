const express = require("express");
const router = express.Router();

//importing the order controllers
const { getTitle, addNewtitle, editTitle } = require("../controllers/title");

router.route("/").get(getTitle);
router.route("/add").post(addNewtitle);
router.route("/edit").put(editTitle);

module.exports = router;
