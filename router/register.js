const express = require("express");
const bcrypt = require("../bcrypt");
const db = require("../middleware/database");
const router = express.Router();

router.get("/", function (req, res) {
  res.render("register.html");
});

module.exports = router;
