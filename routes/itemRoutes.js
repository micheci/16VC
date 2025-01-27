const express = require("express");
const router = express.Router();
const itemController = require("../controllers/itemController");

router.post("/", itemController.listItem); // post new item
router.get("/", itemController.searchItems); // search for item(uses query params to filter via name and/or price)
router.post("/:id/rent", itemController.rentItem); //rent item
router.post("/:id/return", itemController.returnItem); //return ite

module.exports = router;
