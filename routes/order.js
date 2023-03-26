const express = require("express");
const router = express.Router();

//importing the order controllers
const {
  getAllOrders,
  addNewOrder,
  filtering,
} = require("../controllers/order");

router.route("/").get(getAllOrders);
router.route("/add").post(addNewOrder);
router.route("/filtering").get(filtering);

module.exports = router;
