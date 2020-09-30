const express = require("express");
const db = require("../middleware/database");
const bcrypt = require("../bcrypt");
const router = express.Router();

router.get("/", function (req, res) {
  res.render("chat.html");
});

module.exports = router;
